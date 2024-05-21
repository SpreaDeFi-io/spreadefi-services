import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSquidQuoteDto } from 'src/core/resources/quote/dto/create-squid-quote.dto';
import { AaveService } from 'src/libs/strategies/aave/aave.service';
import { SquidService } from 'src/libs/squid/squid.service';
import { PrepareTransactionDto } from './dto/prepare-transaction.dto';
import { StrategyName } from 'src/common/types';
import { SeamlessService } from 'src/libs/strategies/seamless/seamless.service';

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
    txData,
  }: PrepareTransactionDto) {
    let transactions;
    switch (strategyName) {
      case StrategyName.AAVE:
        transactions = await this.aaveService.prepareAaveTransaction({
          action,
          txData,
        });
        return transactions;
      case StrategyName.SEAMLESS:
        transactions = await this.seamlessService.prepareSeamlessTransaction({
          action,
          txData,
        });
        return transactions;
      default:
        throw new BadRequestException('Protocol or action not supported');
    }
  }
}
