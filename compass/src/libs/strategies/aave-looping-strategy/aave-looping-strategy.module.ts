import { DynamicModule, Module } from '@nestjs/common';
import { AaveLoopingStrategyService } from './aave-looping-strategy.service';
import { SquidModule } from 'src/libs/squid/squid.module';

@Module({})
export class AaveLoopingStrategyModule {
  static register(): DynamicModule {
    return {
      imports: [SquidModule.register()],
      module: AaveLoopingStrategyModule,
      providers: [AaveLoopingStrategyService],
      exports: [AaveLoopingStrategyService],
    };
  }
}
