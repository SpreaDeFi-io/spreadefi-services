import { DynamicModule, Module } from '@nestjs/common';
import { AaveLoopingStrategyModule } from '../aave-looping-strategy/aave-looping-strategy.module';
import { SeamlessModule } from '../seamless/seamless.module';
import { AaveLoopingSeamlessService } from './aave-looping-seamless.service';

@Module({})
export class AaveLoopingSeamlessModule {
  static register(): DynamicModule {
    return {
      imports: [
        AaveLoopingStrategyModule.register(),
        SeamlessModule.register(),
      ],
      module: AaveLoopingSeamlessModule,
      providers: [AaveLoopingSeamlessService],
      exports: [AaveLoopingSeamlessService],
    };
  }
}
