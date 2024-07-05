import { DynamicModule, Module } from '@nestjs/common';
import { SquidModule } from 'src/libs/squid/squid.module';
import { SeamlessLoopingStrategyService } from './seamless-looping-strategy.service';

@Module({})
export class SeamlessLoopingStrategyModule {
  static register(): DynamicModule {
    return {
      imports: [SquidModule.register()],
      module: SeamlessLoopingStrategyModule,
      providers: [SeamlessLoopingStrategyService],
      exports: [SeamlessLoopingStrategyService],
    };
  }
}
