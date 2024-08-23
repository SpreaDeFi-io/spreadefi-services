import { DynamicModule, Module } from '@nestjs/common';
import { SquidPortalsService } from './squid-portals.service';
import { SquidModule } from 'src/libs/squid/squid.module';
import { PortalsModule } from 'src/core/resources/portals/portals.module';
import { AssetModule } from 'src/core/resources/asset/asset.module';

@Module({})
export class SquidPortalsModule {
  static register(): DynamicModule {
    return {
      imports: [SquidModule.register(), PortalsModule, AssetModule],
      module: SquidPortalsModule,
      providers: [SquidPortalsService],
      exports: [SquidPortalsService],
    };
  }
}
