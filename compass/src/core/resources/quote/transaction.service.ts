import { StrategyName } from 'src/common/types';
import { SquidService } from 'src/libs/squid/squid.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AaveService } from 'src/libs/strategies/aave/aave.service';
import { PrepareTransactionDto } from './dto/prepare-transaction.dto';
import { SeamlessService } from 'src/libs/strategies/seamless/seamless.service';
import { CreateSquidQuoteDto } from 'src/core/resources/quote/dto/create-squid-quote.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly squidService: SquidService,
    private readonly aaveService: AaveService,
    private readonly seamlessService: SeamlessService,
  ) {}

  async createQuote(createQuoteDto: CreateSquidQuoteDto) {
    const quote = await this.squidService.createQuote(createQuoteDto);

    return quote;
  }

  async prepareTransaction({
    strategyName,
    action,
    txDetails,
  }: PrepareTransactionDto) {
    let transactions;

    switch (strategyName) {
      //* If strategy name is aave, then prepare transactions for aave
      case StrategyName.AAVE:
        transactions = await this.aaveService.prepareAaveTransaction({
          action,
          txDetails,
        });
        return transactions;

      //* If strategy name is seamless, then prepare transactions for seamless
      case StrategyName.SEAMLESS:
        transactions = await this.seamlessService.prepareSeamlessTransaction({
          action,
          txDetails,
        });
        return transactions;

      default:
        throw new BadRequestException('Protocol or action not supported');
    }
  }
}
