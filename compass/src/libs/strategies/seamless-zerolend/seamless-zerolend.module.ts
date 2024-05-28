import { DynamicModule, Module } from '@nestjs/common';
import { SeamlessModule } from '../seamless/seamless.module';
import { ZerolendModule } from '../zerolend/zerolend.module';
import { SeamlessZerolendService } from './seamless-zerolend.service';

@Module({})
export class SeamlessZerolendModule {
  static register(): DynamicModule {
    return {
      imports: [SeamlessModule.register(), ZerolendModule.register()],
      module: SeamlessZerolendModule,
      providers: [SeamlessZerolendService],
      exports: [SeamlessZerolendService],
    };
  }
}
