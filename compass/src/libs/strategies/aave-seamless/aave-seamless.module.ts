import { DynamicModule, Module } from '@nestjs/common';
import { AaveModule } from '../aave/aave.module';
import { SeamlessModule } from '../seamless/seamless.module';
import { AaveSeamlessService } from './aave-seamless.service';

@Module({})
export class AaveSeamlessModule {
  static register(): DynamicModule {
    return {
      imports: [AaveModule.register(), SeamlessModule.register()],
      module: AaveSeamlessModule,
      providers: [AaveSeamlessService],
      exports: [AaveSeamlessService],
    };
  }
}
