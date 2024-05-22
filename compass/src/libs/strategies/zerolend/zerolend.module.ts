import { DynamicModule } from '@nestjs/common';
import { SquidModule } from 'src/libs/squid/squid.module';
import { ZerolendService } from './zerolend.service';

export class ZerolendModule {
  static register(): DynamicModule {
    return {
      imports: [SquidModule.register()],
      module: ZerolendModule,
      providers: [ZerolendService],
      exports: [ZerolendService],
    };
  }
}
