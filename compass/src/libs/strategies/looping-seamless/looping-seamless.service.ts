import { BadRequestException, Injectable } from '@nestjs/common';
import { LoopingStrategyService } from '../looping-strategy/looping-strategy.service';
import {
  PrepareTransactionDto,
  TransactionDetailsDto,
} from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { Action, ExecutableTransaction } from 'src/common/types';
import { SeamlessService } from '../seamless/seamless.service';

@Injectable()
export class LoopingSeamlessService {
  constructor(
    private readonly loopingStrategyService: LoopingStrategyService,
    private readonly seamlessService: SeamlessService,
  ) {}

  async prepareLoopingSeamlessTransaction({
    action,
    txDetails,
  }: Omit<PrepareTransactionDto, 'strategyName'>) {
    let transactions: Array<ExecutableTransaction> = [];
    switch (action) {
      case Action.BORROW_LOOP:
        transactions = await this.seamlessBorrowLoopingSupply(txDetails);
        return transactions;

      case Action.WITHDRAW_LOOP:
        transactions = await this.seamlessWithdrawLoopingSupply(txDetails);
        return transactions;

      default:
        throw new BadRequestException('Undefined action');
    }
  }

  async seamlessBorrowLoopingSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsSeamless = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const seamlessTransactions =
      await this.seamlessService.borrow(txDetailsSeamless);

    transactions.push(...seamlessTransactions);

    const loopingStrategyTransactions =
      await this.loopingStrategyService.createLoopingStrategy(txDetails);

    transactions.push(...loopingStrategyTransactions);

    return transactions;
  }

  async seamlessWithdrawLoopingSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsSeamless = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const seamlessTransactions =
      await this.seamlessService.withdraw(txDetailsSeamless);

    transactions.push(...seamlessTransactions);

    const loopingStrategyTransactions =
      await this.loopingStrategyService.createLoopingStrategy(txDetails);

    transactions.push(...loopingStrategyTransactions);

    return transactions;
  }
}
