import { BadRequestException, Injectable } from '@nestjs/common';
import { AaveLoopingStrategyService } from '../aave-looping-strategy/aave-looping-strategy.service';
import { AaveService } from '../aave/aave.service';
import {
  PrepareTransactionDto,
  TransactionDetailsDto,
} from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { ExecutableTransaction } from 'src/common/types';
import { Action } from 'src/common/types';

//* This looping strategy is in aave and it withdraws/borrows funds from aave to deposit into aave looping strategy
@Injectable()
export class AaveLoopingAaveService {
  constructor(
    private readonly aaveLoopingStrategyService: AaveLoopingStrategyService,
    private readonly aaveService: AaveService,
  ) {}

  async prepareAaveLoopingAaveTransaction({
    action,
    txDetails,
  }: Omit<PrepareTransactionDto, 'strategyName'>) {
    let transactions: Array<ExecutableTransaction> = [];
    switch (action) {
      case Action.BORROW_LOOP:
        transactions = await this.aaveBorrowLoopingSupply(txDetails);
        return transactions;

      case Action.WITHDRAW_LOOP:
        transactions = await this.aaveWithdrawLoopingSupply(txDetails);
        return transactions;

      default:
        throw new BadRequestException('Undefined action');
    }
  }

  async aaveBorrowLoopingSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsAave = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const aaveTransactions = await this.aaveService.borrow(txDetailsAave);

    transactions.push(...aaveTransactions);

    const loopingStrategyTransactions =
      await this.aaveLoopingStrategyService.createLoopingStrategy(txDetails);

    transactions.push(...loopingStrategyTransactions);

    return transactions;
  }

  async aaveWithdrawLoopingSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsAave = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const aaveTransactions = await this.aaveService.withdraw(txDetailsAave);

    transactions.push(...aaveTransactions);

    const loopingStrategyTransactions =
      await this.aaveLoopingStrategyService.createLoopingStrategy(txDetails);

    transactions.push(...loopingStrategyTransactions);

    return transactions;
  }
}
