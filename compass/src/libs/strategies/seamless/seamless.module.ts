import { DynamicModule } from '@nestjs/common';
import { SquidModule } from 'src/libs/squid/squid.module';
import { SeamlessService } from './seamless.service';

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
