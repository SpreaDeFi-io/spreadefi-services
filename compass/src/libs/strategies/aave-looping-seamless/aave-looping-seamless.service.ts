import { BadRequestException, Injectable } from '@nestjs/common';
import { AaveLoopingStrategyService } from '../aave-looping-strategy/aave-looping-strategy.service';
import {
  PrepareTransactionDto,
  TransactionDetailsDto,
} from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { Action, ExecutableTransaction } from 'src/common/types';
import { SeamlessService } from '../seamless/seamless.service';

@Injectable()
export class AaveLoopingSeamlessService {
  constructor(
    private readonly loopingStrategyService: AaveLoopingStrategyService,
    private readonly seamlessService: SeamlessService,
  ) {}

  async prepareAaveLoopingSeamlessTransaction({
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
