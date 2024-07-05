import { BadRequestException, Injectable } from '@nestjs/common';
import { AaveService } from '../aave/aave.service';
import { HopBeefyService } from '../hop-beefy/hop-beefy.service';
import {
  PrepareTransactionDto,
  TransactionDetailsDto,
} from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { Action, ExecutableTransaction } from 'src/common/types';

@Injectable()
export class AaveHopBeefyService {
  constructor(
    private readonly aaveService: AaveService,
    private readonly hopBeefyService: HopBeefyService,
  ) {}

  async prepareAaveHopBeefyTransactions({
    action,
    txDetails,
  }: Omit<PrepareTransactionDto, 'strategyName'>) {
    let transactions: Array<ExecutableTransaction> = [];

    //* we don't have to verify if protocol exists on a chain because it's a combined action
    //* and it automatically verifies that for each protocol

    switch (action) {
      case Action.WITHDRAW_DEPOSIT:
        transactions = await this.aaveWithdrawHopBeefyDeposit(txDetails);
        return transactions;

      case Action.BORROW_DEPOSIT:
        transactions = await this.aaveBorrowHopBeefyDeposit(txDetails);
        return transactions;

      default:
        throw new BadRequestException('Undefined action');
    }
  }

  async aaveWithdrawHopBeefyDeposit(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsAave = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const aaveTransactions = await this.aaveService.withdraw(txDetailsAave);

    transactions.push(...aaveTransactions);

    const hopBeefyTransactions =
      await this.hopBeefyService.addLiquidityAndDeposit(txDetails);

    transactions.push(...hopBeefyTransactions);

    return transactions;
  }

  async aaveBorrowHopBeefyDeposit(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const txDetailsAave = {
      ...txDetails,
      toChain: txDetails.fromChain,
      toToken: txDetails.fromToken,
    };

    const aaveTransactions = await this.aaveService.borrow(txDetailsAave);

    transactions.push(...aaveTransactions);

    const hopBeefyTransactions =
      await this.hopBeefyService.addLiquidityAndDeposit(txDetails);

    transactions.push(...hopBeefyTransactions);

    return transactions;
  }
}
