import { AaveService } from '../aave/aave.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SeamlessService } from '../seamless/seamless.service';
import { Action, ExecutableTransaction, StrategyName } from 'src/common/types';
import {
  PrepareTransactionDto,
  TransactionDetailsDto,
} from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { isProtocolAvailable } from 'src/libs/protocol/protocol-checker';

//! Repay case not handled yet
@Injectable()
export class AaveSeamlessService {
  constructor(
    private readonly aaveService: AaveService,
    private readonly seamlessService: SeamlessService,
  ) {}

  async prepareAaveSeamlessTransaction({
    strategyName,
    action,
    txDetails,
  }: PrepareTransactionDto) {
    let transactions: Array<ExecutableTransaction> = [];

    if (strategyName === StrategyName.AAVE_SEAMLESS) {
      //* check if protocol exists on both chains
      const isAvailableOnFromChain = isProtocolAvailable(
        'Aave',
        txDetails.fromChain,
      );
      const isAvailableOnToChain = isProtocolAvailable(
        'Seamless',
        txDetails.toChain,
      );

      if (!isAvailableOnFromChain || !isAvailableOnToChain)
        throw new BadRequestException(
          'Protocol does not exist on From chain or To chain',
        );

      switch (action) {
        case Action.WITHDRAW_SUPPLY:
          transactions = await this.aaveWithdrawSeamlessSupply(txDetails);
          return transactions;

        case Action.BORROW_SUPPLY:
          transactions = await this.aaveBorrowSeamlessSupply(txDetails);
          return transactions;

        default:
          throw new BadRequestException('Undefined action');
      }
    } else if (strategyName === StrategyName.SEAMLESS_AAVE) {
      //* check if protocol exists on both chains
      const isAvailableOnFromChain = isProtocolAvailable(
        'Seamless',
        txDetails.fromChain,
      );
      const isAvailableOnToChain = isProtocolAvailable(
        'Aave',
        txDetails.toChain,
      );

      if (!isAvailableOnFromChain || !isAvailableOnToChain)
        throw new BadRequestException(
          'Protocol does not exist on From chain or To chain',
        );

      switch (action) {
        case Action.WITHDRAW_SUPPLY:
          transactions = await this.seamlessWithdrawAaveSupply(txDetails);
          return transactions;

        case Action.BORROW_SUPPLY:
          transactions = await this.seamlessBorrowAaveSupply(txDetails);
          return transactions;

        default:
          throw new BadRequestException('Undefined action');
      }
    }
  }

  /**
   * This method withdraws the token from aave and supply to seamless protocol
   * while withdrawing the source chain and dest chain will remain same
   * but while supplying, chains may differ
   * @param {TransactionDetailsDto} txDetails
   */
  async aaveWithdrawSeamlessSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    //* CALL the withdraw function of aave first
    //* withdraw will be on same chain so modify the params
    const txDetailsAave = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const aaveTransactions = await this.aaveService.withdraw(txDetailsAave);

    transactions.push(...aaveTransactions);

    //* For seamless -> the process from here on will be similar just like supplying normally
    const seamlessTransactions = await this.seamlessService.supply(txDetails);

    transactions.push(...seamlessTransactions);

    return transactions;
  }

  /**
   * This method withdraws the token from seamless and supply to aave protocol
   * while withdrawing the source chain and dest chain will remain same
   * but while supplying, chains may differ
   * @param {TransactionDetailsDto} txDetails
   */
  async seamlessWithdrawAaveSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    //* CALL the withdraw function of seamless first
    //* withdraw will be on same chain so modify the params
    const txDetailsSeamless = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const seamlessTransactions =
      await this.seamlessService.withdraw(txDetailsSeamless);

    transactions.push(...seamlessTransactions);

    //* For aave -> the process from here on will be similar just like supplying normally
    const aaveTransactions = await this.aaveService.supply(txDetails);

    transactions.push(...aaveTransactions);

    return transactions;
  }

  /**
   * This method borrows token from aave and supplies to seamless
   * while borrowing the source chain and dest chain will remain same
   * but while supplying, chains may differ
   * @param {TransactionDetailsDto} txDetails
   */
  async aaveBorrowSeamlessSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsAave = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const aaveTransactions = await this.aaveService.borrow(txDetailsAave);

    transactions.push(...aaveTransactions);

    //* For seamless -> the process from here on will be similar just like supplying normally
    const seamlessTransactions = await this.seamlessService.supply(txDetails);

    transactions.push(...seamlessTransactions);

    return transactions;
  }

  /**
   * This method borrows token from seamless and supplies to aave
   * while borrowing the source chain and dest chain will remain same
   * but while supplying, chains may differ
   * @param {TransactionDetailsDto} txDetails
   */
  async seamlessBorrowAaveSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsSeamless = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const seamlessTransactions =
      await this.seamlessService.borrow(txDetailsSeamless);

    transactions.push(...seamlessTransactions);

    //* For aave -> the process from here on will be similar just like supplying normally
    const aaveTransactions = await this.aaveService.supply(txDetails);

    transactions.push(...aaveTransactions);

    return transactions;
  }
}
