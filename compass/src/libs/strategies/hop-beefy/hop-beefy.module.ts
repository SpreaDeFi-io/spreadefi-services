import { DynamicModule, Module } from '@nestjs/common';
import { HopBeefyService } from './hop-beefy.service';
import { SquidModule } from 'src/libs/squid/squid.module';
import { AssetModule } from 'src/core/resources/asset/asset.module';

@Module({})
export class HopBeefyModule {
  static register(): DynamicModule {
    return {
      imports: [AssetModule, SquidModule.register()],
      module: HopBeefyModule,
      providers: [HopBeefyService],
      exports: [HopBeefyService],
    };
  }
}
