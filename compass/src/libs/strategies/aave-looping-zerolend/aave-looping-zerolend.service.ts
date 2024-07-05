import { BadRequestException, Injectable } from '@nestjs/common';
import { AaveLoopingStrategyService } from '../aave-looping-strategy/aave-looping-strategy.service';
import { ZerolendService } from '../zerolend/zerolend.service';
import {
  PrepareTransactionDto,
  TransactionDetailsDto,
} from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { ExecutableTransaction } from 'src/common/types';
import { Action } from 'src/common/types';

@Injectable()
export class AaveLoopingZerolendService {
  constructor(
    private readonly loopingStrategyService: AaveLoopingStrategyService,
    private readonly zerolendService: ZerolendService,
  ) {}

  async prepareAaveLoopingZerolendTransaction({
    action,
    txDetails,
  }: Omit<PrepareTransactionDto, 'strategyName'>) {
    let transactions: Array<ExecutableTransaction> = [];
    switch (action) {
      case Action.BORROW_LOOP:
        transactions = await this.zerolendBorrowLoopingSupply(txDetails);
        return transactions;

      case Action.WITHDRAW_LOOP:
        transactions = await this.zerolendWithdrawLoopingSupply(txDetails);
        return transactions;

      default:
        throw new BadRequestException('Undefined action');
    }
  }

  async zerolendBorrowLoopingSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsZerolend = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const zerolendTransactions =
      await this.zerolendService.borrow(txDetailsZerolend);

    transactions.push(...zerolendTransactions);

    const loopingStrategyTransactions =
      await this.loopingStrategyService.createLoopingStrategy(txDetails);

    transactions.push(...loopingStrategyTransactions);

    return transactions;
  }

  async zerolendWithdrawLoopingSupply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsZerolend = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const zerolendTransactions =
      await this.zerolendService.withdraw(txDetailsZerolend);

    transactions.push(...zerolendTransactions);

    const loopingStrategyTransactions =
      await this.loopingStrategyService.createLoopingStrategy(txDetails);

    transactions.push(...loopingStrategyTransactions);

    return transactions;
  }
}
