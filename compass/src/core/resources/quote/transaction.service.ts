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
import { SeamlessZerolendService } from 'src/libs/strategies/seamless-zerolend/seamless-zerolend.service';
import { LoopingStrategyService } from 'src/libs/strategies/looping-strategy/looping-strategy.service';
import { HopBeefyService } from 'src/libs/strategies/hop-beefy/hop-beefy.service';
import { LoopingAaveService } from 'src/libs/strategies/looping-aave/looping-aave.service';
import { LoopingZerolendService } from 'src/libs/strategies/looping-zerolend/looping-zerolend.service';
import { LoopingSeamlessService } from 'src/libs/strategies/looping-seamless/looping-seamless.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly squidService: SquidService,
    private readonly aaveService: AaveService,
    private readonly seamlessService: SeamlessService,
    private readonly zerolendService: ZerolendService,
    private readonly aaveSeamlessService: AaveSeamlessService,
    private readonly aaveZerolendService: AaveZerolendService,
    private readonly seamlessZerolendService: SeamlessZerolendService,
    private readonly loopingStrategyService: LoopingStrategyService,
    private readonly loopingAaveService: LoopingAaveService,
    private readonly loopingSeamlessService: LoopingSeamlessService,
    private readonly loopingZerolendService: LoopingZerolendService,
    private readonly hopBeefyService: HopBeefyService,
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

        return transactions;

      //* If it is a combined strategy, related to seamless and zerolend
      case StrategyName.SEAMLESS_ZEROLEND || StrategyName.ZEROLEND_SEAMLESS:
        transactions =
          await this.seamlessZerolendService.prepareSeamlessZerolendTransaction(
            {
              strategyName,
              action,
              txDetails,
            },
          );

        return transactions;

      //* If it is a looping strategy
      case StrategyName.LOOPING_STRATEGY:
        transactions =
          await this.loopingStrategyService.createLoopingStrategy(txDetails);

        return transactions;

      //* If it is a looping strategy combined with aave
      case StrategyName.LOOPING_AAVE:
        transactions =
          await this.loopingAaveService.prepareLoopingAaveTransaction({
            action,
            txDetails,
          });

        return transactions;

      //* If it is a looping strategy combined with seamless
      case StrategyName.LOOPING_SEAMLESS:
        transactions =
          await this.loopingSeamlessService.prepareLoopingSeamlessTransaction({
            action,
            txDetails,
          });

        return transactions;

      //* If it is a looping strategy combined with zerolend
      case StrategyName.LOOPING_ZEROLEND:
        transactions =
          await this.loopingZerolendService.prepareLoopingZerolendTransaction({
            action,
            txDetails,
          });

        return transactions;

      //* If we are depositing into hop and beefy
      case StrategyName.HOP_BEEFY:
        transactions =
          await this.hopBeefyService.addLiquidityAndDeposit(txDetails);

        return transactions;

      default:
        throw new BadRequestException('Protocol or action not supported');
    }
  }
}
