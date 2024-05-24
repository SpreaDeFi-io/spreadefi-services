// src/cron/cron.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApyService } from '../apy/apy.service';
import { CRON_JOB_2H } from 'src/common/constants';

@Injectable()
export class CronService {
  constructor(private readonly apyService: ApyService) {}

  @Cron(CRON_JOB_2H) // Adjust the cron expression as needed
  async handleCron() {
    try {
      this.apyService.updateApy();
    } catch (error) {
      console.error('Error updating APY:', error);
    }
  }

  // For manual testing
  async manualCron() {
    await this.handleCron();
  }
}
