import { BadRequestException } from '@nestjs/common';
import { Action } from 'src/common/types';
import {
  PrepareTransactionDto,
  TransactionDetailsDto,
} from 'src/core/resources/quote/dto/prepare-transaction.dto';

export class ZerolendService {
  async prepareAaveTransaction({
    action,
    txDetails,
  }: Omit<PrepareTransactionDto, 'strategyName'>) {
    let transactions: any[];
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

  async supply(txDetails: TransactionDetailsDto) {}

  async borrow(txDetails: TransactionDetailsDto) {}

  async repay(txDetails: TransactionDetailsDto) {}

  async withdraw(txDetails: TransactionDetailsDto) {}
}
