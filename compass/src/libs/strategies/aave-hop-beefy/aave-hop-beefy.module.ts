import { DynamicModule, Module } from '@nestjs/common';
import { AaveModule } from '../aave/aave.module';
import { HopBeefyModule } from '../hop-beefy/hop-beefy.module';
import { AaveHopBeefyService } from './aave-hop-beefy.service';

@Module({})
export class AaveHopBeefyModule {
  static register(): DynamicModule {
    return {
      imports: [AaveModule.register(), HopBeefyModule.register()],
      module: AaveHopBeefyModule,
      providers: [AaveHopBeefyService],
      exports: [AaveHopBeefyService],
    };
  }
}
