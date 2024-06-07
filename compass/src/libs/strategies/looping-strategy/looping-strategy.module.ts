import { DynamicModule, Module } from '@nestjs/common';
import { LoopingStrategyService } from './looping-strategy.service';
import { SquidModule } from 'src/libs/squid/squid.module';

@Module({})
export class LoopingStrategyModule {
  static register(): DynamicModule {
    return {
      imports: [SquidModule.register()],
      module: LoopingStrategyModule,
      providers: [LoopingStrategyService],
      exports: [LoopingStrategyService],
    };
  }
}
