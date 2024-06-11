import { DynamicModule, Module } from '@nestjs/common';
import { LoopingStrategyModule } from '../looping-strategy/looping-strategy.module';
import { AaveModule } from '../aave/aave.module';
import { LoopingAaveService } from './looping-aave.service';

@Module({})
export class LoopingAaveModule {
  static register(): DynamicModule {
    return {
      imports: [LoopingStrategyModule.register(), AaveModule.register()],
      module: LoopingAaveModule,
      providers: [LoopingAaveService],
      exports: [LoopingAaveService],
    };
  }
}
