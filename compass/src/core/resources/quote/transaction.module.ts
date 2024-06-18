import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { SquidModule } from 'src/libs/squid/squid.module';
import { AaveModule } from 'src/libs/strategies/aave/aave.module';
import { SeamlessModule } from 'src/libs/strategies/seamless/seamless.module';
import { ZerolendModule } from 'src/libs/strategies/zerolend/zerolend.module';
import { AaveSeamlessModule } from 'src/libs/strategies/aave-seamless/aave-seamless.module';
import { AaveZerolendModule } from 'src/libs/strategies/aave-zerolend/aave-zerolend.module';
import { SeamlessZerolendModule } from 'src/libs/strategies/seamless-zerolend/seamless-zerolend.module';
import { LoopingStrategyModule } from 'src/libs/strategies/looping-strategy/looping-strategy.module';
import { HopBeefyModule } from 'src/libs/strategies/hop-beefy/hop-beefy.module';
import { LoopingAaveModule } from 'src/libs/strategies/looping-aave/looping-aave.module';
import { LoopingSeamlessModule } from 'src/libs/strategies/looping-seamless/looping-seamless.module';
import { LoopingZerolendModule } from 'src/libs/strategies/looping-zerolend/looping-zerolend.module';

@Module({
  imports: [
    SquidModule.register(),
    AaveModule.register(),
    ZerolendModule.register(),
    SeamlessModule.register(),
    AaveSeamlessModule.register(),
    AaveZerolendModule.register(),
    LoopingStrategyModule.register(),
    SeamlessZerolendModule.register(),
    LoopingAaveModule.register(),
    LoopingSeamlessModule.register(),
    LoopingZerolendModule.register(),
    HopBeefyModule.register(),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
