import { Module } from '@nestjs/common';
import { ApyService } from './apy.service';
import { ApyController } from './apy.controller';

@Module({
  controllers: [ApyController],
  providers: [ApyService],
})
export class ApyModule {}
