import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  chainIdToChainPortals,
  SQUID_MULTICALL_CONTRACT,
} from 'src/common/constants';
import { portalsHandler } from 'src/common/hooks/portals';
import { Action, ExecutableTransaction } from 'src/common/types';
import { PortalsTransaction } from 'src/common/types/portals';
import { AssetRepository } from 'src/core/resources/asset/asset.repository';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { PortalsService } from 'src/core/resources/portals/portals.service';
import { SquidService } from 'src/libs/squid/squid.service';
import { chains } from 'src/common/constants/config/chain';

@Injectable()
export class SquidPortalsService {
  constructor(
    private readonly squidService: SquidService,
    private readonly portalsService: PortalsService,
    private readonly assetRepository: AssetRepository,
  ) {}

  //!it can be improved later on by checking if the token is already supported by squid then swap by squid otherwise use portals
  async prepareSquidPortalsMigration(txDetails: TransactionDetailsDto) {
    try {
      const transactions: Array<ExecutableTransaction> = [];

      //!add a check here to see if tokens are supported or not

      //! this migration is only supported for portals -> portals token and portals -> other tokens but not other protocols
      //* if chain is same then we only need to use portals and squid together
      if (txDetails.fromChain === txDetails.toChain) {
        const approvalData = await this.portalsService.approvePortals(
          txDetails.fromAddress,
          chainIdToChainPortals[txDetails.fromChain],
          txDetails.fromToken,
          txDetails.fromAmount,
        );

        if (approvalData.context.shouldApprove) {
          transactions.push({
            chain: txDetails.fromChain,
            type: Action.APPROVE,
            to: approvalData.approve.to,
            tx: approvalData.approve.data,
          });
        }

        transactions.push({
          chain: txDetails.fromChain,
          type: Action.PORTALS,
          to: '',
          tx: this.portalsService.portalsUrlBuilder(
            txDetails.fromAddress,
            chainIdToChainPortals[txDetails.fromChain],
            txDetails.fromToken,
            txDetails.fromAmount,
            txDetails.toToken,
            txDetails?.slippage,
          ),
        });

        return transactions;
      } else {
        //* Build the pre hook transaction to swap portals token to weth
        //!This migration is only applicable from portals token to portals token as already discussed
        // const portalsPreHookTx: PortalsTransaction =
        //   await this.portalsService.prepareTransaction(
        //     SQUID_MULTICALL_CONTRACT,
        //     chainIdToChainPortals[txDetails.fromChain],
        //     txDetails.fromToken,
        //     txDetails.fromAmount,
        //     chains[txDetails.fromChain].wethAddress,
        //     txDetails?.slippage,
        //   );

        //*Create portals estimate to get the min amount of weth we will receive
        const portalsEstimate = await this.portalsService.simulateTransaction(
          txDetails.fromAddress,
          chainIdToChainPortals[txDetails.fromChain],
          txDetails.fromToken,
          txDetails.fromAmount,
          chains[txDetails.fromChain].wethAddress,
          txDetails?.slippage,
        );

        if (portalsEstimate.statusCode && portalsEstimate.statusCode !== 200)
          throw new InternalServerErrorException(portalsEstimate.message);

        //*Create a portals transaction for user but first portals need approval from user
        const approvalData = await this.portalsService.approvePortals(
          txDetails.fromAddress,
          chainIdToChainPortals[txDetails.fromChain],
          txDetails.fromToken,
          txDetails.fromAmount,
        );

        //*Check if apporval is already given if not create transaction
        if (approvalData.context.shouldApprove) {
          transactions.push({
            chain: txDetails.fromChain,
            type: Action.APPROVE,
            to: approvalData.approve.to,
            tx: approvalData.approve.data,
          });
        }

        //*Create the portals transaction for swapping portals token to weth
        transactions.push({
          chain: txDetails.fromChain,
          type: Action.PORTALS,
          to: '',
          tx: this.portalsService.portalsUrlBuilder(
            txDetails.fromAddress,
            chainIdToChainPortals[txDetails.fromChain],
            txDetails.fromToken,
            txDetails.fromAmount,
            chains[txDetails.fromChain].wethAddress,
            txDetails?.slippage,
          ),
        });

        //* Create an estimate from squid for post hook
        const squidEstimate = await this.squidService.createQuote({
          ...txDetails,
          fromToken: chains[txDetails.fromChain].wethAddress,
          fromAmount: portalsEstimate.minOutputAmount,
          toToken: chains[txDetails.toChain].wethAddress,
        });

        const toAmountMin = squidEstimate.estimate.toAmountMin;

        //*Build the post hook transaction to swap weth to toToken on dest chain
        const portalsPostHookTx: PortalsTransaction =
          await this.portalsService.prepareTransaction(
            SQUID_MULTICALL_CONTRACT, //* this is the address of squid
            chainIdToChainPortals[txDetails.toChain],
            chains[txDetails.toChain].wethAddress,
            toAmountMin,
            txDetails.toToken,
            txDetails?.slippage,
          );

        // const { preHook, postHook } = portalsMigrationHandler(
        //   txDetails,
        //   portalsPreHookTx,
        //   portalsPostHookTx,
        // );

        let squidTx;

        if (
          txDetails.toToken.toLowerCase() !==
          chains[txDetails.toChain].wethAddress.toLowerCase()
        ) {
          const postHook = portalsHandler(txDetails, portalsPostHookTx);
          squidTx = await this.squidService.createQuote({
            ...txDetails,
            fromToken: chains[txDetails.fromChain].wethAddress,
            fromAmount: portalsEstimate.minOutputAmount,
            toToken: chains[txDetails.toChain].wethAddress,
            // preHook,
            postHook,
          });
        } else {
          squidTx = await this.squidService.createQuote({
            ...txDetails,
            fromToken: chains[txDetails.fromChain].wethAddress,
            fromAmount: portalsEstimate.minOutputAmount,
            toToken: chains[txDetails.toChain].wethAddress,
          });
        }

        transactions.push({
          chain: txDetails.fromChain,
          type: Action.SQUID,
          to: '',
          tx: squidTx,
        });

        return transactions;
      }
      // else {
      //   //!This migration is only applicable from portals token to portals token as already discussed
      //   //*APPROVE the tokens first
      //   const approveTx = encodeFunctionData(ERC20_ABI, 'approve', [
      //     '0xce16F69375520ab01377ce7B88f5BA8C48F8D666',
      //     txDetails.fromAmount,
      //   ]);

      //   transactions.push({
      //     to: txDetails.fromToken,
      //     tx: approveTx,
      //     type: Action.APPROVE,
      //     chain: txDetails.fromChain,
      //   });

      //   //* Build the pre hook transaction to swap portals token to weth
      //   const portalsPreHookTx: PortalsTransaction =
      //     await this.portalsService.prepareTransaction(
      //       SQUID_MULTICALL_CONTRACT,
      //       chainIdToChainPortals[txDetails.fromChain],
      //       txDetails.fromToken,
      //       txDetails.fromAmount,
      //       chains[txDetails.fromChain].wethAddress,
      //       txDetails?.slippage,
      //     );

      //   //   //* Create an estimate from squid for post hook
      //   const squidEstimate = await this.squidService.createQuote({
      //     ...txDetails,
      //     fromToken: chains[txDetails.fromChain].wethAddress,
      //     fromAmount: portalsPreHookTx.context.minOutputAmount,
      //     toToken: chains[txDetails.toChain].wethAddress,
      //   });

      //   const toAmountMin = squidEstimate.estimate.toAmountMin;

      //   //   //*Build the post hook transaction to swap weth to toToken on dest chain
      //   const portalsPostHookTx: PortalsTransaction =
      //     await this.portalsService.prepareTransaction(
      //       SQUID_MULTICALL_CONTRACT, //* this is the address of squid
      //       chainIdToChainPortals[txDetails.toChain],
      //       chains[txDetails.toChain].wethAddress,
      //       toAmountMin,
      //       txDetails.toToken,
      //       txDetails?.slippage,
      //     );

      //   const { preHook, postHook } = portalsMigrationHandler(
      //     txDetails,
      //     portalsPreHookTx,
      //     portalsPostHookTx,
      //   );

      //   let squidTx;

      //   if (
      //     txDetails.toToken.toLowerCase() !==
      //     chains[txDetails.toChain].wethAddress.toLowerCase()
      //   ) {
      //     squidTx = await this.squidService.createQuote({
      //       ...txDetails,
      //       fromToken: chains[txDetails.fromChain].wethAddress,
      //       fromAmount: portalsPreHookTx.context.minOutputAmount,
      //       toToken: chains[txDetails.toChain].wethAddress,
      //       preHook,
      //       postHook,
      //     });
      //   } else {
      //     squidTx = await this.squidService.createQuote({
      //       ...txDetails,
      //       fromToken: chains[txDetails.fromChain].wethAddress,
      //       fromAmount: portalsPreHookTx.context.minOutputAmount,
      //       toToken: chains[txDetails.toChain].wethAddress,
      //       preHook,
      //     });
      //   }

      //   transactions.push({
      //     chain: txDetails.fromChain,
      //     type: Action.SQUID,
      //     to: '',
      //     tx: squidTx,
      //   });

      //   return transactions;
      // }
    } catch (error: any) {
      console.log('error: ', error);
      throw new InternalServerErrorException(error);
    }
  }
}
