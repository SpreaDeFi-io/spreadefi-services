import { ExecutableTransaction, StrategyName } from 'src/common/types';
import { SquidService } from 'src/libs/squid/squid.service';
import { Injectable } from '@nestjs/common';
import { AaveService } from 'src/libs/strategies/aave/aave.service';
import { PrepareTransactionDto } from './dto/prepare-transaction.dto';
import { SeamlessService } from 'src/libs/strategies/seamless/seamless.service';
import { CreateSquidQuoteDto } from 'src/core/resources/quote/dto/create-squid-quote.dto';
import { ZerolendService } from 'src/libs/strategies/zerolend/zerolend.service';
import { AaveSeamlessService } from 'src/libs/strategies/aave-seamless/aave-seamless.service';
import { AaveZerolendService } from 'src/libs/strategies/aave-zerolend/aave-zerolend.service';
import { SeamlessZerolendService } from 'src/libs/strategies/seamless-zerolend/seamless-zerolend.service';
import { AaveLoopingStrategyService } from 'src/libs/strategies/aave-looping-strategy/aave-looping-strategy.service';
import { HopBeefyService } from 'src/libs/strategies/hop-beefy/hop-beefy.service';
import { AaveLoopingAaveService } from 'src/libs/strategies/aave-looping-aave/aave-looping-aave.service';
import { AaveLoopingZerolendService } from 'src/libs/strategies/aave-looping-zerolend/aave-looping-zerolend.service';
import { AaveLoopingSeamlessService } from 'src/libs/strategies/aave-looping-seamless/aave-looping-seamless.service';
import { AaveHopBeefyService } from 'src/libs/strategies/aave-hop-beefy/aave-hop-beefy.service';
import { SeamlessLoopingStrategyService } from 'src/libs/strategies/seamless-looping-strategy/seamless-looping-strategy.service';
import { ZerolendLoopingStrategyService } from 'src/libs/strategies/zerolend-looping-strategy/zerolend-looping-strategy.service';
import { SquidPortalsService } from 'src/libs/strategies/squid-portals/squid-portals.service';
import {
  PORTALS_ENSO_MIGRATION_PROTOCOLS,
  PORTALS_ENSO_SUPPORTED_PROTOCOLS,
} from 'src/common/constants';
import { PathFinderService } from 'src/libs/pathfinder/pathfinder.service';

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
    private readonly aaveLoopingStrategyService: AaveLoopingStrategyService,
    private readonly seamlessLoopingStrategyService: SeamlessLoopingStrategyService,
    private readonly zerolendLoopingStrategyService: ZerolendLoopingStrategyService,
    private readonly aaveLoopingAaveService: AaveLoopingAaveService,
    private readonly aaveLoopingSeamlessService: AaveLoopingSeamlessService,
    private readonly aaveLoopingZerolendService: AaveLoopingZerolendService,
    private readonly hopBeefyService: HopBeefyService,
    private readonly aaveHopBeefyService: AaveHopBeefyService,
    private readonly squidPortalsService: SquidPortalsService,
    private readonly pathFinderService: PathFinderService,
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

    //* switch statement for custom strategies
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
      case StrategyName.AAVE_SEAMLESS:
        transactions =
          await this.aaveSeamlessService.prepareAaveSeamlessTransaction({
            strategyName,
            action,
            txDetails,
          });
        return transactions;

      //* If it is a combined strategy, related to aave and seamless
      case StrategyName.SEAMLESS_AAVE:
        transactions =
          await this.aaveSeamlessService.prepareAaveSeamlessTransaction({
            strategyName,
            action,
            txDetails,
          });
        return transactions;

      //* If it is a combined strategy, related to aave and zerolend
      case StrategyName.AAVE_ZEROLEND:
        transactions =
          await this.aaveZerolendService.prepareAaveZerolendTransaction({
            strategyName,
            action,
            txDetails,
          });

        return transactions;

      //* If it is a combined strategy, related to aave and zerolend
      case StrategyName.ZEROLEND_AAVE:
        transactions =
          await this.aaveZerolendService.prepareAaveZerolendTransaction({
            strategyName,
            action,
            txDetails,
          });

        return transactions;

      //* If it is a combined strategy, related to seamless and zerolend
      case StrategyName.SEAMLESS_ZEROLEND:
        transactions =
          await this.seamlessZerolendService.prepareSeamlessZerolendTransaction(
            {
              strategyName,
              action,
              txDetails,
            },
          );

        return transactions;

      //* If it is a combined strategy, related to seamless and zerolend
      case StrategyName.ZEROLEND_SEAMLESS:
        transactions =
          await this.seamlessZerolendService.prepareSeamlessZerolendTransaction(
            {
              strategyName,
              action,
              txDetails,
            },
          );

        return transactions;

      //* If it is a looping strategy of aave
      case StrategyName.AAVE_LOOPING:
        transactions =
          await this.aaveLoopingStrategyService.createLoopingStrategy(
            txDetails,
          );

        return transactions;

      case StrategyName.SEAMLESS_LOOPING:
        transactions =
          await this.seamlessLoopingStrategyService.createLoopingStrategy(
            txDetails,
          );

        return transactions;

      case StrategyName.ZEROLEND_LOOPING:
        transactions =
          await this.zerolendLoopingStrategyService.createLoopingStrategy(
            txDetails,
          );

        return transactions;

      //* If it is a looping strategy combined with aave
      case StrategyName.AAVE_LOOPING_AAVE:
        transactions =
          await this.aaveLoopingAaveService.prepareAaveLoopingAaveTransaction({
            action,
            txDetails,
          });

        return transactions;

      //* If it is a looping strategy combined with seamless
      case StrategyName.AAVE_LOOPING_SEAMLESS:
        transactions =
          await this.aaveLoopingSeamlessService.prepareAaveLoopingSeamlessTransaction(
            {
              action,
              txDetails,
            },
          );

        return transactions;

      //* If it is a looping strategy combined with zerolend
      case StrategyName.AAVE_LOOPING_ZEROLEND:
        transactions =
          await this.aaveLoopingZerolendService.prepareAaveLoopingZerolendTransaction(
            {
              action,
              txDetails,
            },
          );

        return transactions;

      //* If we are depositing into hop and beefy
      case StrategyName.HOP_BEEFY:
        transactions =
          await this.hopBeefyService.addLiquidityAndDeposit(txDetails);

        return transactions;

      case StrategyName.AAVE_HOP_BEEFY:
        transactions =
          await this.aaveHopBeefyService.prepareAaveHopBeefyTransactions({
            action,
            txDetails,
          });

        return transactions;
    }

    //* switch statement for portals strategies
    switch (true) {
      case PORTALS_ENSO_SUPPORTED_PROTOCOLS.includes(strategyName):
        transactions = await this.pathFinderService.createPath(
          txDetails,
          action,
        );

        return transactions;

      case PORTALS_ENSO_MIGRATION_PROTOCOLS.includes(strategyName):
        transactions = await this.pathFinderService.createPath(
          txDetails,
          action,
        );

        return transactions;
    }
  }
}
