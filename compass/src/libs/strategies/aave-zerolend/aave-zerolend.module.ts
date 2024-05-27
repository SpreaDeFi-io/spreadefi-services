import { DynamicModule, Module } from '@nestjs/common';
import { AaveModule } from '../aave/aave.module';
import { ZerolendModule } from '../zerolend/zerolend.module';
import { AaveZerolendService } from './aave-zerolend.service';
import { AaveSeamlessService } from '../aave-seamless/aave-seamless.service';

@Module({})
export class AaveZerolendModule {
  static register(): DynamicModule {
    return {
      imports: [AaveModule.register(), ZerolendModule.register()],
      module: AaveZerolendModule,
      providers: [AaveZerolendService],
      exports: [AaveSeamlessService],
    };
  }
}
