import { DynamicModule, Module } from '@nestjs/common';
import { SquidModule } from 'src/libs/squid/squid.module';
import { SeamlessService } from './seamless.service';

@Module({})
export class SeamlessModule {
  static register(): DynamicModule {
    return {
      imports: [SquidModule.register()],
      module: SeamlessModule,
      providers: [SeamlessService],
      exports: [SeamlessService],
    };
  }
}
