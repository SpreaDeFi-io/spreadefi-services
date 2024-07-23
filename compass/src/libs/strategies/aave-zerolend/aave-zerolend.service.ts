import { BadRequestException, Injectable } from '@nestjs/common';
import { AaveService } from '../aave/aave.service';
import { ZerolendService } from '../zerolend/zerolend.service';
import { Action, ExecutableTransaction, StrategyName } from 'src/common/types';
import {
  PrepareTransactionDto,
  TransactionDetailsDto,
} from 'src/core/resources/quote/dto/prepare-transaction.dto';
// import { isProtocolAvailable } from 'src/libs/protocol/protocol-checker';

@Injectable()
export class AaveZerolendService {
  constructor(
    private readonly aaveService: AaveService,
    private readonly zerolendService: ZerolendService,
  ) {}

  async prepareAaveZerolendTransaction({
    strategyName,
    action,
    txDetails,
  }: PrepareTransactionDto) {
    let transactions: Array<ExecutableTransaction> = [];

    if (strategyName === StrategyName.AAVE_ZEROLEND) {
      //* check if protocol exists on both chains
      // const isAvailableOnFromChain = isProtocolAvailable(
      //   'Aave',
      //   txDetails.fromChain,
      // );
      // const isAvailableOnToChain = isProtocolAvailable(
      //   'Zerolend',
      //   txDetails.toChain,
      // );

      // if (!isAvailableOnFromChain || !isAvailableOnToChain)
      //   throw new BadRequestException(
      //     'Protocol does not exist on From chain or To chain',
      //   );

      switch (action) {
        case Action.WITHDRAW_SUPPLY:
          transactions = await this.aaveWithdrawZerolendSupply(txDetails);
          return transactions;

        case Action.BORROW_SUPPLY:
          transactions = await this.aaveBorrowZerolendSupply(txDetails);
          return transactions;

        default:
          throw new BadRequestException('Undefined action');
      }
    } else if (strategyName === StrategyName.ZEROLEND_AAVE) {
      //* check if protocol exists on both chains
      // const isAvailableOnFromChain = isProtocolAvailable(
      //   'Zerolend',
      //   txDetails.fromChain,
      // );
      // const isAvailableOnToChain = isProtocolAvailable(
      //   'Aave',
      //   txDetails.toChain,
      // );

      // if (!isAvailableOnFromChain || !isAvailableOnToChain)
      //   throw new BadRequestException(
      //     'Protocol does not exist on From chain or To chain',
      //   );

      switch (action) {
        case Action.WITHDRAW_SUPPLY:
          transactions = await this.zerolendWithdrawAaveSupply(txDetails);
          return transactions;

        case Action.BORROW_SUPPLY:
          transactions = await this.zerolendBorrowAaveSupply(txDetails);
          return transactions;

        default:
          throw new BadRequestException('Undefined action');
      }
    }
  }

  /**
   * This method withdraws the token from aave and supply to zerolend protocol
   * while withdrawing the source chain and dest chain will remain same
   * but while supplying, chains may differ
   * @param {TransactionDetailsDto} txDetails
   */
  async aaveWithdrawZerolendSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsAave = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const aaveTransactions = await this.aaveService.withdraw(txDetailsAave);

    transactions.push(...aaveTransactions);

    //* For zerolend -> the process from here on will be similar just like supplying normally
    const zerolendTransactions = await this.zerolendService.supply(txDetails);

    transactions.push(...zerolendTransactions);

    return transactions;
  }

  /**
   * This method withdraws the token from zerolend and supply to aave protocol
   * while withdrawing the source chain and dest chain will remain same
   * but while supplying, chains may differ
   * @param {TransactionDetailsDto} txDetails
   */
  async zerolendWithdrawAaveSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsZerolend = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const zerolendTransactions =
      await this.zerolendService.withdraw(txDetailsZerolend);

    transactions.push(...zerolendTransactions);

    //* For aave -> the process from here on will be similar just like supplying normally
    const aaveTransactions = await this.aaveService.supply(txDetails);

    transactions.push(...aaveTransactions);

    return transactions;
  }

  /**
   * This method borrows token from aave and supplies to zerolend
   * while borrowing the source chain and dest chain will remain same
   * but while supplying, chains may differ
   * @param {TransactionDetailsDto} txDetails
   */
  async aaveBorrowZerolendSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsAave = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const aaveTransactions = await this.aaveService.borrow(txDetailsAave);

    transactions.push(...aaveTransactions);

    //* For zerolend -> the process from here on will be similar just like supplying normally
    const zerolendTransactions = await this.zerolendService.supply(txDetails);

    transactions.push(...zerolendTransactions);

    return transactions;
  }

  /**
   * This method borrows token from zerolend and supplies to aave
   * while borrowing the source chain and dest chain will remain same
   * but while supplying, chains may differ
   * @param {TransactionDetailsDto} txDetails
   */
  async zerolendBorrowAaveSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsZerolend = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const zerolendTransactions =
      await this.zerolendService.borrow(txDetailsZerolend);

    transactions.push(...zerolendTransactions);

    const aaveTransactions = await this.aaveService.supply(txDetails);

    transactions.push(...aaveTransactions);

    return transactions;
  }
}
