import { DynamicModule, Module } from '@nestjs/common';
import { AaveService } from './aave.service';
import { SquidModule } from 'src/libs/squid/squid.module';
import { LifiModule } from 'src/libs/lifi/lifi.module';

@Module({})
export class AaveModule {
  static register(): DynamicModule {
    return {
      imports: [SquidModule.register(), LifiModule.register()],
      module: AaveModule,
      providers: [AaveService],
      exports: [AaveService],
    };
  }
}
