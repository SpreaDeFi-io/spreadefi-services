import { DynamicModule, Module } from '@nestjs/common';
import { SquidModule } from 'src/libs/squid/squid.module';
import { ZerolendLoopingStrategyService } from './zerolend-looping-strategy.service';

@Module({})
export class ZerolendLoopingStrategyModule {
  static register(): DynamicModule {
    return {
      imports: [SquidModule.register()],
      module: ZerolendLoopingStrategyModule,
      providers: [ZerolendLoopingStrategyService],
      exports: [ZerolendLoopingStrategyService],
    };
  }
}
