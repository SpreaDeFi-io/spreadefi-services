import { DynamicModule, Module } from '@nestjs/common';
import { LifiService } from './lifi.service';

@Module({})
export class LifiModule {
  static register(): DynamicModule {
    return {
      module: LifiModule,
      providers: [LifiService],
      exports: [LifiService],
    };
  }
}
