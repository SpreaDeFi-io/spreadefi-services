import { AaveLoopingZerolendService } from './aave-looping-zerolend.service';
import { DynamicModule, Module } from '@nestjs/common';
import { AaveLoopingStrategyModule } from '../aave-looping-strategy/aave-looping-strategy.module';
import { ZerolendModule } from '../zerolend/zerolend.module';

@Module({})
export class AaveLoopingZerolendModule {
  static register(): DynamicModule {
    return {
      imports: [
        AaveLoopingStrategyModule.register(),
        ZerolendModule.register(),
      ],
      module: AaveLoopingZerolendModule,
      providers: [AaveLoopingZerolendService],
      exports: [AaveLoopingZerolendService],
    };
  }
}
