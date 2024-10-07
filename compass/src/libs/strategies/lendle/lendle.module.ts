import { DynamicModule, Module } from '@nestjs/common';
import { LifiModule } from 'src/libs/lifi/lifi.module';
import { LendleService } from './lendle.service';

@Module({})
export class LendleModule {
  static register(): DynamicModule {
    return {
      imports: [LifiModule.register()],
      module: LendleModule,
      providers: [LendleService],
      exports: [LendleService],
    };
  }
}
