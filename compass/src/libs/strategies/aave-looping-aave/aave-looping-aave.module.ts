import { DynamicModule, Module } from '@nestjs/common';
import { AaveLoopingStrategyModule } from '../aave-looping-strategy/aave-looping-strategy.module';
import { AaveModule } from '../aave/aave.module';
import { AaveLoopingAaveService } from './aave-looping-aave.service';

@Module({})
export class AaveLoopingAaveModule {
  static register(): DynamicModule {
    return {
      imports: [AaveLoopingStrategyModule.register(), AaveModule.register()],
      module: AaveLoopingAaveModule,
      providers: [AaveLoopingAaveService],
      exports: [AaveLoopingAaveService],
    };
  }
}
