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
import { AaveLoopingStrategyModule } from 'src/libs/strategies/aave-looping-strategy/aave-looping-strategy.module';
import { HopBeefyModule } from 'src/libs/strategies/hop-beefy/hop-beefy.module';
import { AaveLoopingAaveModule } from 'src/libs/strategies/aave-looping-aave/aave-looping-aave.module';
import { AaveLoopingSeamlessModule } from 'src/libs/strategies/aave-looping-seamless/aave-looping-seamless.module';
import { AaveLoopingZerolendModule } from 'src/libs/strategies/aave-looping-zerolend/aave-looping-zerolend.module';
import { AaveHopBeefyModule } from 'src/libs/strategies/aave-hop-beefy/aave-hop-beefy.module';
import { SeamlessLoopingStrategyModule } from 'src/libs/strategies/seamless-looping-strategy/seamless-looping-strategy.module';
import { ZerolendLoopingStrategyModule } from 'src/libs/strategies/zerolend-looping-strategy/zerolend-looping-strategy.module';
import { SquidPortalsModule } from 'src/libs/strategies/squid-portals/squid-portals.module';
import { PathfinderModule } from 'src/libs/pathfinder/pathfinder.module';

@Module({
  imports: [
    SquidModule.register(),
    AaveModule.register(),
    ZerolendModule.register(),
    SeamlessModule.register(),
    AaveSeamlessModule.register(),
    AaveZerolendModule.register(),
    AaveLoopingStrategyModule.register(),
    SeamlessLoopingStrategyModule.register(),
    ZerolendLoopingStrategyModule.register(),
    SeamlessZerolendModule.register(),
    AaveLoopingAaveModule.register(),
    AaveLoopingSeamlessModule.register(),
    AaveLoopingZerolendModule.register(),
    HopBeefyModule.register(),
    AaveHopBeefyModule.register(),
    SquidPortalsModule.register(),
    PathfinderModule.register(),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
