import { BadRequestException, Injectable } from '@nestjs/common';
import { SeamlessService } from '../seamless/seamless.service';
import { ZerolendService } from '../zerolend/zerolend.service';
import {
  PrepareTransactionDto,
  TransactionDetailsDto,
} from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { Action, ExecutableTransaction, StrategyName } from 'src/common/types';

@Injectable()
export class SeamlessZerolendService {
  constructor(
    private readonly seamlessService: SeamlessService,
    private readonly zerolendService: ZerolendService,
  ) {}

  async prepareSeamlessZerolendTransaction({
    strategyName,
    action,
    txDetails,
  }: PrepareTransactionDto) {
    let transactions: Array<ExecutableTransaction> = [];

    if (strategyName === StrategyName.SEAMLESS_ZEROLEND) {
      switch (action) {
        case Action.WITHDRAW_SUPPLY:
          transactions = await this.seamlessWithdrawZerolendSupply(txDetails);
          return transactions;

        case Action.BORROW_SUPPLY:
          transactions = await this.seamlessBorrowZerolendSupply(txDetails);
          return transactions;

        default:
          throw new BadRequestException('Undefined action');
      }
    } else if (strategyName === StrategyName.ZEROLEND_SEAMLESS) {
      switch (action) {
        case Action.WITHDRAW_SUPPLY:
          transactions = await this.zerolendWithdrawSeamlessSupply(txDetails);
          return transactions;

        case Action.BORROW_SUPPLY:
          transactions = await this.zerolendBorrowSeamlessSupply(txDetails);
          return transactions;

        default:
          throw new BadRequestException('Undefined action');
      }
    }
  }
  /**
   * This method withdraws the token from seamless and supply to zerolend protocol
   * while withdrawing the source chain and dest chain will remain same
   * but while supplying, chains may differ
   * @param {TransactionDetailsDto} txDetails
   */
  async seamlessWithdrawZerolendSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsSeamless = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const seamlessTransactions =
      await this.seamlessService.withdraw(txDetailsSeamless);

    transactions.push(...seamlessTransactions);

    //* For zerolend -> the process from here on will be similar just like supplying normally
    const zerolendTransactions = await this.zerolendService.supply(txDetails);

    transactions.push(...zerolendTransactions);

    return transactions;
  }

  async zerolendWithdrawSeamlessSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsZerolend = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const zerolendTransactions =
      await this.zerolendService.withdraw(txDetailsZerolend);

    transactions.push(...zerolendTransactions);

    //* For seamless -> the process from here on will be similar just like supplying normally
    const seamlessTransactions = await this.seamlessService.supply(txDetails);

    transactions.push(...seamlessTransactions);

    return transactions;
  }

  /**
   * This method borrows token from seamless and supplies to zerolend
   * while borrowing the source chain and dest chain will remain same
   * but while supplying, chains may differ
   * @param {TransactionDetailsDto} txDetails
   */
  async seamlessBorrowZerolendSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsSeamless = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const seamlessTransactions =
      await this.seamlessService.borrow(txDetailsSeamless);

    transactions.push(...seamlessTransactions);

    //* For zerolend -> the process from here on will be similar just like supplying normally
    const zerolendTransactions = await this.zerolendService.supply(txDetails);

    transactions.push(...zerolendTransactions);

    return transactions;
  }

  async zerolendBorrowSeamlessSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsZerolend = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const zerolendTransactions =
      await this.zerolendService.borrow(txDetailsZerolend);

    transactions.push(...zerolendTransactions);

    //* For seamless -> the process from here on will be similar just like supplying normally
    const seamlessTransactions = await this.seamlessService.supply(txDetails);

    transactions.push(...seamlessTransactions);

    return transactions;
  }
}
