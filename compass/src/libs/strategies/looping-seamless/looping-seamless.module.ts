import { DynamicModule, Module } from '@nestjs/common';
import { LoopingStrategyModule } from '../looping-strategy/looping-strategy.module';
import { SeamlessModule } from '../seamless/seamless.module';
import { LoopingSeamlessService } from './looping-seamless.service';

@Module({})
export class LoopingSeamlessModule {
  static register(): DynamicModule {
    return {
      imports: [LoopingStrategyModule.register(), SeamlessModule.register()],
      module: LoopingSeamlessModule,
      providers: [LoopingSeamlessService],
      exports: [LoopingSeamlessService],
    };
  }
}
