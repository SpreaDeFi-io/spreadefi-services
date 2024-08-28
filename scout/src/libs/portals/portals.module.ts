import { DynamicModule, Module } from '@nestjs/common';
import { PortalsService } from './portals.service';

@Module({})
export class PortalsModule {
  static register(): DynamicModule {
    return {
      module: PortalsModule,
      providers: [PortalsService],
      exports: [PortalsService],
    };
  }
}
