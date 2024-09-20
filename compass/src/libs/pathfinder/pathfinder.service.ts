import { BadRequestException, Injectable } from '@nestjs/common';
import { SquidService } from '../squid/squid.service';
import { PortalsService } from 'src/core/resources/portals/portals.service';
import { EnsoService } from 'src/core/resources/enso/enso.service';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { Action, ExecutableTransaction } from 'src/common/types';
import {
  chainIdToChainPortals,
  SQUID_MULTICALL_CONTRACT,
} from 'src/common/constants';
import { chains } from 'src/common/constants/config/chain';
import { ethers } from 'ethers';
import { portalsHandler } from 'src/common/hooks/portals';
import { SuccessPortalsTransaction } from 'src/common/types/portals';
import { ensoHandler } from 'src/common/hooks/enso';
import { ChainType } from '@0xsquid/squid-types';

//*Path finder aims to solve the bridging issue that currently exists in our protocol
//*It currently relies on Squid for bridgind and enso and portals for pre hooks and post hooks before to swap tokens
//*that does not exist in squid
//*In case of single chain deposit we only use portals/enso to swap tokens
//*In case of cross chain deposit if the token already exists on squid then we bridge the token to weth on dest chain and then use enso/portals to convert it into toToken
//*If token does not exist on squid then we swap the token into weth on source chain using portals/enso and then we bridge weth to dest chain and use enso/portals again
//*to swap it into toToken
//*If we are on same chain and try to use enso to swap from x token to y token it fails -> the way around is this to swap x token into weth and then swap weth back into y token

@Injectable()
export class PathFinderService {
  constructor(
    private readonly squidService: SquidService,
    private readonly portalsService: PortalsService,
    private readonly ensoService: EnsoService,
  ) {}

  async singleChainSwapByEOA(txDetails: TransactionDetailsDto) {
    const transactions: ExecutableTransaction[] = [];
    let minAmountOut: string;

    try {
      //If simulated transaction is built that means normal transaction will build as well
      const portalsSimulationTx = await this.portalsService.simulateTransaction(
        chainIdToChainPortals[txDetails.fromChain],
        txDetails.fromToken,
        txDetails.fromAmount,
        txDetails.toToken,
        txDetails?.slippage,
      );

      minAmountOut = portalsSimulationTx.minOutputAmount;

      //Build the approval transaction
      const approvalTx = await this.portalsService.createApproveTransaction(
        txDetails.fromAddress,
        chainIdToChainPortals[txDetails.fromChain],
        txDetails.fromToken,
        txDetails.fromAmount,
      );

      if (Object.keys(approvalTx).length !== 0)
        transactions.push(approvalTx as ExecutableTransaction);

      //If simulation passed then we can build the transaction
      //Build the portals url to be executed in frontend
      const portalsTx = this.portalsService.portalsUrlBuilder(
        txDetails.fromAddress,
        chainIdToChainPortals[txDetails.fromChain],
        txDetails.fromToken,
        txDetails.fromAmount,
        txDetails.toToken,
        txDetails?.slippage,
      );

      transactions.push({
        to: '',
        type: Action.PORTALS,
        tx: portalsTx,
        chain: txDetails.fromChain,
      });
    } catch (error) {
      try {
        //If we landed in this block that means portal simulation failed
        //Then here we can build the enso transaction for frontend
        //There can be cases where swap from token X to token Y is not possible
        //In those cases it is possible with enso to swap X token to WETH
        //and then swap WETH back to Y token
        const ensoApprovalTx = await this.ensoService.createApproveTransaction(
          txDetails.fromAddress,
          txDetails.fromChain,
          txDetails.fromToken,
          txDetails.fromAmount,
        );

        transactions.push(ensoApprovalTx);

        try {
          //Build the enso transaction
          //If the direct conversion fails -> fallback to another conversion method
          const ensoTx = await this.ensoService.prepareTransaction(
            txDetails.fromAddress,
            txDetails.fromChain,
            txDetails.fromAddress,
            txDetails.fromToken,
            txDetails.fromAmount,
            txDetails.toToken,
            true,
            txDetails.slippage,
          );

          transactions.push({
            chain: txDetails.fromChain,
            type: Action.ENSO,
            tx: ensoTx.tx.data,
            to: ensoTx.tx.to,
          });

          minAmountOut = ensoTx.amountOut;
        } catch (error) {
          const ensoTxToWeth = await this.ensoService.prepareTransaction(
            txDetails.fromAddress,
            txDetails.fromChain,
            txDetails.fromAddress,
            txDetails.fromToken,
            txDetails.fromAmount,
            chains[txDetails.fromChain].wethAddress,
            true,
            txDetails.slippage,
          );

          const ensoApprovalTx =
            await this.ensoService.createApproveTransaction(
              txDetails.fromAddress,
              txDetails.fromChain,
              chains[txDetails.fromChain].wethAddress,
              ensoTxToWeth.amountOut,
            );

          transactions.push(ensoApprovalTx);

          const ensoTxToAnotherToken =
            await this.ensoService.prepareTransaction(
              txDetails.fromAddress,
              txDetails.fromChain,
              txDetails.fromAddress,
              chains[txDetails.fromChain].wethAddress,
              ensoTxToWeth.amountOut,
              txDetails.toToken,
              true,
              txDetails.slippage,
            );

          transactions.push({
            chain: txDetails.fromChain,
            type: Action.ENSO,
            tx: ensoTxToWeth.tx.data,
            to: ensoTxToWeth.tx.to,
          });

          transactions.push(ensoApprovalTx);

          transactions.push({
            chain: txDetails.fromChain,
            type: Action.ENSO,
            tx: ensoTxToAnotherToken.tx.data,
            to: ensoTxToAnotherToken.tx.to,
          });
        }
      } catch (error) {
        //*If Enso failed too then throw the error
        throw new BadRequestException(error);
      }
    }

    return { transactions, minAmountOut };
  }

  async createPath(txDetails: TransactionDetailsDto, action: Action) {
    try {
      const transactions: ExecutableTransaction[] = [];

      //If source and destination chain are same then we can directly get the transaction using enso or squid
      if (txDetails.fromChain === txDetails.toChain) {
        const { transactions: singleChainTransactions } =
          await this.singleChainSwapByEOA(txDetails);

        return singleChainTransactions;
      } else {
        //If source chain and destination chain are not same then
        //swap the token first into weth using portals or enso
        //bridge it using squid or lifi(to be implemented later)
        //then swap the weth into desired token again on destination chain
        //If action is deposit directly use squid
        let minWethOutAmountSourceChain: string;
        if (action !== Action.DEPOSIT) {
          const { transactions: singleChainTransactions, minAmountOut } =
            await this.singleChainSwapByEOA({
              ...txDetails,
              toToken: chains[txDetails.fromChain].wethAddress,
            });

          minWethOutAmountSourceChain = minAmountOut;

          transactions.push(...singleChainTransactions);
        }

        const squidChains = await this.squidService.getSquidChains();

        //If toChain or fromChain is not supported by squid then switch the method to lifi
        if (
          !squidChains.find(
            (squidChain) =>
              squidChain.chainId === txDetails.toChain ||
              !squidChains.find(
                (squidChain) => squidChain.chainId === txDetails.fromChain,
              ),
          )
        )
          //!instead of throwing bad request should we call another func?
          throw new BadRequestException('Chain not supported by squid');

        //if toToken can directly be achieved using squid then don't use postHook
        const squidTokens = await this.squidService.getSquidTokens();
        const formattedToToken = ethers.getAddress(txDetails.toToken);

        const isTokenAvailableOnSquid = squidTokens.find((squidToken) => {
          return (
            squidToken.type === ChainType.EVM &&
            ethers.getAddress(squidToken.address) === formattedToToken &&
            squidToken.chainId === txDetails.toChain
          );
        });

        //If token is not available on squid then use postHook otherwise not
        if (!isTokenAvailableOnSquid) {
          // Create an estimate from squid for post hook
          const squidEstimate = await this.squidService.createQuote({
            ...txDetails,
            fromToken:
              action === Action.DEPOSIT
                ? txDetails.fromToken
                : chains[txDetails.fromChain].wethAddress,
            fromAmount:
              action === Action.DEPOSIT
                ? txDetails.fromAmount
                : minWethOutAmountSourceChain,
            toToken: chains[txDetails.toChain].wethAddress,
          });

          const toAmountMinWethDestChain = squidEstimate.estimate.toAmountMin; //weth amount on destination chain

          //Build the post hook with portals, if portals failed, build with enso
          try {
            const portalsPostHookTx =
              await this.portalsService.prepareTransaction(
                SQUID_MULTICALL_CONTRACT,
                chainIdToChainPortals[txDetails.toChain],
                chains[txDetails.toChain].wethAddress,
                toAmountMinWethDestChain,
                txDetails.toToken,
                txDetails?.slippage,
              );

            const portalsPostHook = portalsHandler(
              txDetails,
              portalsPostHookTx as SuccessPortalsTransaction,
            );

            const squidTx = await this.squidService.createQuote({
              ...txDetails,
              fromToken:
                action === Action.DEPOSIT
                  ? txDetails.fromToken
                  : chains[txDetails.fromChain].wethAddress,
              fromAmount:
                action === Action.DEPOSIT
                  ? txDetails.fromAmount
                  : minWethOutAmountSourceChain,
              toToken: chains[txDetails.toChain].wethAddress,
              postHook: portalsPostHook,
            });

            transactions.push({
              chain: txDetails.fromChain,
              type: Action.SQUID,
              to: '',
              tx: squidTx,
            });
          } catch (error) {
            try {
              //If we landed in this block that means portals failed, then switch to enso
              const ensoPostHookApproveTx = await this.ensoService.approveEnso(
                SQUID_MULTICALL_CONTRACT,
                txDetails.toChain,
                chains[txDetails.toChain].wethAddress,
                toAmountMinWethDestChain,
              );

              const ensoPostHookTx = await this.ensoService.prepareTransaction(
                SQUID_MULTICALL_CONTRACT,
                txDetails.toChain,
                txDetails.toAddress,
                chains[txDetails.toChain].wethAddress,
                toAmountMinWethDestChain,
                txDetails.toToken,
                true,
                txDetails?.slippage,
              );

              const ensoPostHook = ensoHandler(
                txDetails,
                {
                  to: ensoPostHookApproveTx.tx.to,
                  tx: ensoPostHookApproveTx.tx.data,
                },
                {
                  to: ensoPostHookTx.tx.to,
                  tx: ensoPostHookTx.tx.data,
                },
              );

              const squidTx = await this.squidService.createQuote({
                ...txDetails,
                fromToken:
                  action === Action.DEPOSIT
                    ? txDetails.fromToken
                    : chains[txDetails.fromChain].wethAddress,
                fromAmount:
                  action === Action.DEPOSIT
                    ? txDetails.fromAmount
                    : minWethOutAmountSourceChain,
                toToken: chains[txDetails.toChain].wethAddress,
                postHook: ensoPostHook,
              });

              transactions.push({
                chain: txDetails.fromChain,
                type: Action.SQUID,
                to: '',
                tx: squidTx,
              });
            } catch (error) {
              throw new BadRequestException(error);
            }
          }
        } else {
          //If token is already available on squid then we don't need any post hook
          const squidTx = await this.squidService.createQuote({
            ...txDetails,
            fromToken:
              action === Action.DEPOSIT
                ? txDetails.fromToken
                : chains[txDetails.fromChain].wethAddress,
            fromAmount:
              action === Action.DEPOSIT
                ? txDetails.fromAmount
                : minWethOutAmountSourceChain,
            toToken: txDetails.toToken,
          });

          transactions.push({
            chain: txDetails.fromChain,
            type: Action.SQUID,
            to: '',
            tx: squidTx,
          });
        }

        return transactions;
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
