import { DynamicModule, Module } from '@nestjs/common';
import { SquidModule } from '../squid/squid.module';
import { PortalsModule } from 'src/core/resources/portals/portals.module';
import { PathFinderService } from './pathfinder.service';
import { EnsoModule } from 'src/core/resources/enso/enso.module';

@Module({})
export class PathfinderModule {
  static register(): DynamicModule {
    return {
      imports: [SquidModule.register(), PortalsModule, EnsoModule],
      module: PathfinderModule,
      providers: [PathFinderService],
      exports: [PathFinderService],
    };
  }
}
