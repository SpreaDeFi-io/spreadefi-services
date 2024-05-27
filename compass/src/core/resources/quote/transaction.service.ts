import { ExecutableTransaction, StrategyName } from 'src/common/types';
import { SquidService } from 'src/libs/squid/squid.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AaveService } from 'src/libs/strategies/aave/aave.service';
import { PrepareTransactionDto } from './dto/prepare-transaction.dto';
import { SeamlessService } from 'src/libs/strategies/seamless/seamless.service';
import { CreateSquidQuoteDto } from 'src/core/resources/quote/dto/create-squid-quote.dto';
import { ZerolendService } from 'src/libs/strategies/zerolend/zerolend.service';
import { AaveSeamlessService } from 'src/libs/strategies/aave-seamless/aave-seamless.service';
import { AaveZerolendService } from 'src/libs/strategies/aave-zerolend/aave-zerolend.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly squidService: SquidService,
    private readonly aaveService: AaveService,
    private readonly seamlessService: SeamlessService,
    private readonly zerolendService: ZerolendService,
    private readonly aaveSeamlessService: AaveSeamlessService,
    private readonly aaveZerolendService: AaveZerolendService,
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
    let transactions: Array<ExecutableTransaction> = [];

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

      //* If strategy name is zerolend, then prepare transactions for zerolend
      case StrategyName.ZEROLEND:
        transactions = await this.zerolendService.prepareZerolendTransaction({
          action,
          txDetails,
        });
        return transactions;

      //* If it is a combined strategy, related to aave and seamless
      case StrategyName.AAVE_SEAMLESS || StrategyName.SEAMLESS_AAVE:
        transactions =
          await this.aaveSeamlessService.prepareAaveSeamlessTransaction({
            strategyName,
            action,
            txDetails,
          });
        return transactions;

      //* If it is a combined strategy, related to aave and zerolend
      case StrategyName.AAVE_ZEROLEND || StrategyName.ZEROLEND_AAVE:
        transactions =
          await this.aaveZerolendService.prepareAaveZerolendTransaction({
            strategyName,
            action,
            txDetails,
          });

      default:
        throw new BadRequestException('Protocol or action not supported');
    }
  }
}
