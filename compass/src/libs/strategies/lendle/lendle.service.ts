import { convertQuoteToRoute } from '@lifi/sdk';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ETHEREUM_ADDRESS_LIFI,
  ETHEREUM_ADDRESS_SQUID,
} from 'src/common/constants';
import { ERC20_ABI, LENDLE_POOL_ABI } from 'src/common/constants/abi';
import { lendleConfig } from 'src/common/constants/config/lendle';
import { encodeFunctionData } from 'src/common/ethers';
import {
  lendleLifiRepayHandler,
  lendleLifiSupplyHandler,
} from 'src/common/lifi/contract-calls/lendle';
import { Action, ExecutableTransaction } from 'src/common/types';
import {
  PrepareTransactionDto,
  TransactionDetailsDto,
} from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { LifiService } from 'src/libs/lifi/lifi.service';

@Injectable()
export class LendleService {
  constructor(private readonly lifiService: LifiService) {}

  async prepareLendleTransaction({
    action,
    txDetails,
  }: Omit<PrepareTransactionDto, 'strategyName'>) {
    let transactions: Array<ExecutableTransaction> = [];

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

    //* if user wants to supply same token he has on the same chain then we don't need to use lifi
    if (
      txDetails.fromChain === txDetails.toChain &&
      txDetails.fromToken === txDetails.toToken
    ) {
      //** Approve the tokens first
      //** If token is ethereum we don't need approval

      if (txDetails.fromToken !== ETHEREUM_ADDRESS_LIFI) {
        const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
          lendleConfig[txDetails.fromChain].poolAddress,
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
      const tx2 = encodeFunctionData(LENDLE_POOL_ABI, 'deposit', [
        txDetails.fromToken, //! fromToken will be different if eth is supplied
        txDetails.fromAmount,
        txDetails.fromAddress,
        0,
      ]);

      transactions.push({
        chain: txDetails.fromChain,
        to: lendleConfig[txDetails.fromChain].poolAddress,
        type: Action.SUPPLY,
        tx: tx2,
      });

      return transactions;
    } else {
      //* in case of Li.Fi the fromAmount will be toAmount
      const route = await this.lifiService.getLifiRoute({
        fromAddress: txDetails.fromAddress,
        fromChainId: +txDetails.fromChain,
        toChainId: +txDetails.toChain,
        fromTokenAddress: txDetails.fromToken,
        toTokenAddress: txDetails.toToken,
        fromAmount: txDetails.fromAmount,
      });

      const toAmount = route.toAmount;

      const contractCalls = lendleLifiSupplyHandler(txDetails, toAmount);

      const lifiContractQuote = await this.lifiService.getLifiContractQuote({
        fromAddress: txDetails.fromAddress,
        fromChain: txDetails.fromChain,
        toChain: txDetails.toChain,
        fromToken: txDetails.fromToken,
        toToken: txDetails.toToken,
        toAmount: toAmount,
        contractCalls: contractCalls,
      });

      const contractRoute = convertQuoteToRoute(lifiContractQuote);

      transactions.push({
        chain: txDetails.fromChain,
        to: '',
        type: Action.LIFI,
        tx: contractRoute,
      });

      return transactions;
    }
  }

  async borrow(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    //* call borrow function
    const tx1 = encodeFunctionData(LENDLE_POOL_ABI, 'borrow', [
      txDetails.fromToken, //! fromToken will be different if we are borrowing eth
      txDetails.fromAmount,
      2,
      0,
      txDetails.fromAddress,
    ]);

    transactions.push({
      chain: txDetails.fromChain,
      to: lendleConfig[txDetails.fromChain].poolAddress,
      type: Action.BORROW,
      tx: tx1,
    });

    //* if user wants different token, or token on different chain or different token on different chain
    //* then call lifi
    if (
      txDetails.fromChain !== txDetails.toChain ||
      txDetails.fromToken !== txDetails.toToken
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
    }

    return transactions;
  }

  async repay(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    //* if user wants to repay on different chain or wants to pay from different token or wants to pay on different chain
    //* from different token then use lifi
    if (
      txDetails.fromChain !== txDetails.toChain ||
      txDetails.fromToken !== txDetails.toToken
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

      const contractCalls = lendleLifiRepayHandler(txDetails, toAmount);

      const lifiContractQuote = await this.lifiService.getLifiContractQuote({
        fromAddress: txDetails.fromAddress,
        fromChain: txDetails.fromChain,
        toChain: txDetails.toChain,
        fromToken: txDetails.fromToken,
        toToken: txDetails.toToken,
        toAmount: toAmount,
        contractCalls: contractCalls,
        contractOutputsToken: txDetails.toToken,
      });

      const contractRoute = convertQuoteToRoute(lifiContractQuote);

      transactions.push({
        chain: txDetails.fromChain,
        to: '',
        type: Action.LIFI,
        tx: contractRoute,
      });

      return transactions;
    } else {
      if (txDetails.toToken !== ETHEREUM_ADDRESS_SQUID) {
        const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
          lendleConfig[txDetails.fromChain].poolAddress,
          txDetails.fromAmount,
        ]);

        transactions.push({
          chain: txDetails.fromChain,
          to: txDetails.fromToken,
          type: Action.APPROVE,
          tx: tx1,
        });
      }

      const tx2 = encodeFunctionData(LENDLE_POOL_ABI, 'repay', [
        txDetails.fromToken, //! fromToken will differ here if token is ETH
        txDetails.fromAmount,
        1,
        0,
        txDetails.fromAddress,
      ]);

      transactions.push({
        chain: txDetails.fromChain,
        to: lendleConfig[txDetails.fromChain].poolAddress,
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
      lendleConfig[txDetails.fromChain].poolAddress,
      txDetails.fromAmount,
    ]);

    transactions.push({
      chain: txDetails.fromChain,
      to: txDetails.fundToken,
      type: Action.APPROVE,
      tx: tx1,
    });

    //** Call the Withdraw method
    const tx2 = encodeFunctionData(LENDLE_POOL_ABI, 'withdraw', [
      txDetails.fromToken, //!fromToken will differ here in case of ETH
      txDetails.fromAmount,
      txDetails.fromAddress,
    ]);

    transactions.push({
      chain: txDetails.fromChain,
      to: lendleConfig[txDetails.fromChain].poolAddress,
      type: Action.WITHDRAW,
      tx: tx2,
    });

    if (
      txDetails.fromChain !== txDetails.toChain ||
      txDetails.fromToken !== txDetails.toToken
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
    }

    return transactions;
  }
}
