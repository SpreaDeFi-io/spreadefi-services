import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSquidQuoteDto } from 'src/core/resources/quote/dto/create-squid-quote.dto';
import { AaveService } from 'src/libs/strategies/aave/aave.service';
import { SquidService } from 'src/libs/squid/squid.service';
import { PrepareTransactionDto } from './dto/prepare-transaction.dto';
import { StrategyName } from 'src/common/types';

@Injectable()
export class TransactionService {
  constructor(
    private readonly squidService: SquidService,
    private readonly aaveService: AaveService,
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
    switch (strategyName) {
      case StrategyName.AAVE:
        await this.aaveService.prepareAaveTransaction({ action, txData });
        break;
      case StrategyName.SEAMLESS:
        console.log('Do something');
        break;
      default:
        throw new BadRequestException('Protocol or action not supported');
    }
  }
}
