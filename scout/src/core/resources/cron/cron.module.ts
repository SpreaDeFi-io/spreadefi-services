// src/cron/cron.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { CronController } from './cron.controllet';
import { ApyModule } from '../apy/apy.module';

@Module({
  imports: [ScheduleModule.forRoot(), ApyModule],
  providers: [CronService],
  controllers: [CronController],
})
export class CronModule {}
