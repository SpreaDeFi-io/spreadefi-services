import { DynamicModule, Module } from '@nestjs/common';
import { HopBeefyService } from './hop-beefy.service';
import { AssetRepository } from 'src/core/resources/asset/asset.repository';
import { SquidModule } from 'src/libs/squid/squid.module';

@Module({})
export class HopBeefyModule {
  static register(): DynamicModule {
    return {
      imports: [AssetRepository, SquidModule.register()],
      module: HopBeefyModule,
      providers: [HopBeefyService],
      exports: [HopBeefyService],
    };
  }
}
