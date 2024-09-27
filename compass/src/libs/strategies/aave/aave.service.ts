import { Action, ExecutableTransaction } from 'src/common/types';
import { encodeFunctionData } from 'src/common/ethers';
import { SquidService } from 'src/libs/squid/squid.service';
import { aaveConfig } from 'src/common/constants/config/aave';
import { AAVE_POOL_ABI, ERC20_ABI } from 'src/common/constants/abi';
import { BadRequestException, Injectable } from '@nestjs/common';
import { aaveRepayHandler, aaveSupplyHandler } from 'src/common/hooks/aave';
import {
  aaveLifiRepayHandler,
  aaveLifiSupplyHandler,
} from 'src/common/lifi/contract-calls/aave';
import {
  PrepareTransactionDto,
  TransactionDetailsDto,
} from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { ETHEREUM_ADDRESS_SQUID, LIFI_CHAINS } from 'src/common/constants';
import { LifiService } from 'src/libs/lifi/lifi.service';
import { convertQuoteToRoute } from '@lifi/sdk';
// import { isProtocolAvailable } from 'src/libs/protocol/protocol-checker';

@Injectable()
export class AaveService {
  constructor(
    private readonly squidService: SquidService,
    private readonly lifiService: LifiService,
  ) {}

  async prepareAaveTransaction({
    action,
    txDetails,
  }: Omit<PrepareTransactionDto, 'strategyName'>) {
    let transactions: Array<ExecutableTransaction> = [];

    // //* check if protocol exists on dest chain
    // const isAvailableOnToChain = isProtocolAvailable('Aave', txDetails.toChain);

    // if (!isAvailableOnToChain)
    //   throw new BadRequestException('Protocol does not exist on to chain');

    switch (action) {
      case Action.SUPPLY:
        transactions = await this.supply(txDetails);
        return transactions;

      case Action.BORROW:
        transactions = await this.borrow(txDetails);
        return transactions;

      case Action.REPAY:
        transactions = await this.repay(txDetails);
        return transactions;

      case Action.WITHDRAW:
        transactions = await this.withdraw(txDetails);
        return transactions;

      default:
        throw new BadRequestException('Undefined action');
    }
  }

  async supply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    //* If user wants to supply on the same chain and same token, then we don't need to use squid
    if (
      txDetails.fromChain === txDetails.toChain &&
      txDetails.fromToken === txDetails.toToken
    ) {
      //** Approve the tokens first
      //** If token is ethereum we don't need approval
      if (txDetails.fromToken !== ETHEREUM_ADDRESS_SQUID) {
        const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
          aaveConfig[txDetails.fromChain].poolAddress,
          txDetails.fromAmount,
        ]);

        transactions.push({
          chain: txDetails.fromChain,
          to: txDetails.fromToken,
          type: Action.APPROVE,
          tx: tx1,
        });
      }

      //** call the supply method
      const tx2 = encodeFunctionData(AAVE_POOL_ABI, 'supply', [
        txDetails.fromToken, //! fromToken will be different if eth is supplied
        txDetails.fromAmount,
        txDetails.fromAddress,
        0,
      ]);

      transactions.push({
        chain: txDetails.fromChain,
        to: aaveConfig[txDetails.fromChain].poolAddress,
        type: Action.SUPPLY,
        tx: tx2,
      });

      return transactions;
    } else {
      //* get the quote from squid
      //* prepare the post hook

      //*If this statement is true then use lifi for the transaction otherwise use squid
      if (
        LIFI_CHAINS.filter(
          (chain) =>
            chain.chainId === txDetails.toChain ||
            chain.chainId === txDetails.fromChain,
        ).length > 0
      ) {
        const route = await this.lifiService.getLifiRoute({
          fromAddress: txDetails.fromAddress,
          fromChainId: +txDetails.fromChain,
          toChainId: +txDetails.toChain,
          fromTokenAddress: txDetails.fromToken,
          toTokenAddress: txDetails.toToken,
          fromAmount: txDetails.fromAmount,
        });

        const toAmount = route.toAmount;

        const contractCalls = aaveLifiSupplyHandler(txDetails, toAmount);

        const lifiContractQuote = await this.lifiService.getLifiContractQuote({
          fromAddress: txDetails.fromAddress,
          fromChain: txDetails.fromChain,
          toChain: txDetails.toChain,
          fromToken: txDetails.fromToken,
          toToken: txDetails.toToken,
          fromAmount: txDetails.fromAmount,
          contractCalls: contractCalls,
        });

        const contractRoute = convertQuoteToRoute(lifiContractQuote);

        transactions.push({
          chain: txDetails.fromChain,
          to: '',
          type: Action.LIFI,
          tx: contractRoute,
        });
      } else {
        const hook = aaveSupplyHandler(txDetails);

        //* prepare squid Transaction data
        const tx1 = await this.squidService.createQuote({
          ...txDetails,
          postHook: hook,
        });

        transactions.push({
          chain: txDetails.fromChain,
          to: '',
          type: Action.SQUID,
          tx: tx1,
        });
      }
      return transactions;
    }
  }

  async borrow(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    //* call borrow function
    const tx1 = encodeFunctionData(AAVE_POOL_ABI, 'borrow', [
      txDetails.fromToken, //! fromToken will be different if we are borrowing eth
      txDetails.fromAmount,
      2,
      0,
      txDetails.fromAddress,
    ]);

    transactions.push({
      chain: txDetails.fromChain,
      to: aaveConfig[txDetails.fromChain].poolAddress,
      type: Action.BORROW,
      tx: tx1,
    });

    //* if user wants different token, or token on different chain or different token on different chain
    //* then call squid
    if (
      txDetails.fromChain !== txDetails.toChain ||
      txDetails.fromToken !== txDetails.toToken
    ) {
      //*If this statement is true then use lifi for the transaction otherwise use squid
      if (
        LIFI_CHAINS.filter(
          (chain) =>
            chain.chainId === txDetails.toChain ||
            chain.chainId === txDetails.fromChain,
        ).length > 0
      ) {
        const route = await this.lifiService.getLifiRoute({
          fromAddress: txDetails.fromAddress,
          fromChainId: +txDetails.fromChain,
          toChainId: +txDetails.toChain,
          fromTokenAddress: txDetails.fromToken,
          toTokenAddress: txDetails.toToken,
          fromAmount: txDetails.fromAmount,
        });

        transactions.push({
          chain: txDetails.fromChain,
          to: '',
          type: Action.LIFI,
          tx: route,
        });
      } else {
        const tx2 = await this.squidService.createQuote(txDetails);

        transactions.push({
          chain: txDetails.fromChain,
          to: '',
          type: Action.SQUID,
          tx: tx2,
        });
      }
    }

    return transactions;
  }

  async repay(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    //* if user wants to repay on different chain or wants to pay from different token or wants to pay on different chain
    //* from different token then use squid
    if (
      txDetails.fromChain !== txDetails.toChain ||
      txDetails.fromToken !== txDetails.toToken
    ) {
      if (
        LIFI_CHAINS.filter(
          (chain) =>
            chain.chainId === txDetails.toChain ||
            chain.chainId === txDetails.fromChain,
        ).length > 0
      ) {
        const lifiRoute = await this.lifiService.getLifiRoute({
          fromAddress: txDetails.fromAddress,
          fromChainId: +txDetails.fromChain,
          toChainId: +txDetails.toChain,
          fromTokenAddress: txDetails.fromToken,
          toTokenAddress: txDetails.toToken,
          fromAmount: txDetails.fromAmount,
        });

        const toAmount = lifiRoute.toAmount;

        const contractCalls = aaveLifiRepayHandler(txDetails, toAmount);

        const lifiContractQuote = await this.lifiService.getLifiContractQuote({
          fromAddress: txDetails.fromAddress,
          fromChain: txDetails.fromChain,
          toChain: txDetails.toChain,
          fromToken: txDetails.fromToken,
          toToken: txDetails.toToken,
          fromAmount: txDetails.fromAmount,
          contractCalls: contractCalls,
          contractOutputsToken: txDetails.toToken, //! what if the amount of token sent is greater than what is to be repayed, in that case return the remainin amount to the user
        });

        const contractRoute = convertQuoteToRoute(lifiContractQuote);

        transactions.push({
          chain: txDetails.fromChain,
          to: '',
          type: Action.LIFI,
          tx: contractRoute,
        });
      } else {
        const hook = aaveRepayHandler(txDetails);

        const tx1 = await this.squidService.createQuote({
          ...txDetails,
          postHook: hook,
        });

        transactions.push({
          chain: txDetails.fromChain,
          to: '',
          type: Action.SQUID,
          tx: tx1,
        });
      }

      return transactions;
    } else {
      if (txDetails.toToken !== ETHEREUM_ADDRESS_SQUID) {
        const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
          aaveConfig[txDetails.fromChain].poolAddress,
          txDetails.fromAmount,
        ]);

        transactions.push({
          chain: txDetails.fromChain,
          to: txDetails.fromToken,
          type: Action.APPROVE,
          tx: tx1,
        });
      }

      const tx2 = encodeFunctionData(AAVE_POOL_ABI, 'repay', [
        txDetails.fromToken, //! fromToken will differ here if token is ETH
        txDetails.fromAmount,
        2,
        txDetails.fromAddress,
      ]);

      transactions.push({
        chain: txDetails.fromChain,
        to: aaveConfig[txDetails.fromChain].poolAddress,
        type: Action.REPAY,
        tx: tx2,
      });

      return transactions;
    }
  }

  async withdraw(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    //** Take approval of the aToken
    const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
      aaveConfig[txDetails.fromChain].poolAddress,
      txDetails.fromAmount,
    ]);

    transactions.push({
      chain: txDetails.fromChain,
      to: txDetails.fundToken,
      type: Action.APPROVE,
      tx: tx1,
    });

    //** Call the Withdraw method
    const tx2 = encodeFunctionData(AAVE_POOL_ABI, 'withdraw', [
      txDetails.fromToken, //!fromToken will differ here in case of ETH
      txDetails.fromAmount,
      txDetails.fromAddress,
    ]);

    transactions.push({
      chain: txDetails.fromChain,
      to: aaveConfig[txDetails.fromChain].poolAddress,
      type: Action.WITHDRAW,
      tx: tx2,
    });

    //* if user wants different token or wants on different chain or wants different token on different chain
    //* then use squid
    if (
      txDetails.fromChain !== txDetails.toChain ||
      txDetails.fromToken !== txDetails.toToken
    ) {
      if (
        LIFI_CHAINS.filter(
          (chain) =>
            chain.chainId === txDetails.toChain ||
            chain.chainId === txDetails.fromChain,
        ).length > 0
      ) {
        const tx3 = await this.lifiService.getLifiRoute({
          fromAddress: txDetails.fromAddress,
          fromChainId: +txDetails.fromChain,
          toChainId: +txDetails.toChain,
          fromTokenAddress: txDetails.fromToken,
          toTokenAddress: txDetails.toToken,
          fromAmount: txDetails.fromAmount,
        });

        transactions.push({
          chain: txDetails.fromChain,
          to: '',
          type: Action.LIFI,
          tx: tx3,
        });
      } else {
        const tx3 = await this.squidService.createQuote(txDetails);

        transactions.push({
          chain: txDetails.fromChain,
          to: '',
          type: Action.SQUID,
          tx: tx3,
        });
      }
    }

    return transactions;
  }
}
