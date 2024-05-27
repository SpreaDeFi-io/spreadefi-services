import { DynamicModule, Module } from '@nestjs/common';
import { AaveService } from './aave.service';
import { SquidModule } from 'src/libs/squid/squid.module';

@Module({})
export class AaveModule {
  static register(): DynamicModule {
    return {
      imports: [SquidModule.register()],
      module: AaveModule,
      providers: [AaveService],
      exports: [AaveService],
    };
  }
}
