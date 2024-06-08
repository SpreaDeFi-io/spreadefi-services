import { LoopingZerolendService } from './looping-zerolend.service';
import { DynamicModule, Module } from '@nestjs/common';
import { LoopingStrategyModule } from '../looping-strategy/looping-strategy.module';
import { ZerolendModule } from '../zerolend/zerolend.module';

@Module({})
export class LoopingZerolendModule {
  static register(): DynamicModule {
    return {
      imports: [LoopingStrategyModule.register(), ZerolendModule.register()],
      module: LoopingZerolendModule,
      providers: [LoopingZerolendService],
      exports: [LoopingZerolendService],
    };
  }
}
