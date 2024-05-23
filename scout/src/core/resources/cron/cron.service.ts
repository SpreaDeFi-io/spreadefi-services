// src/cron/cron.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApyService } from '../apy/apy.service';

@Injectable()
export class CronService {
  constructor(private readonly apyService: ApyService) {}

  @Cron('0 */2 * * *') // Adjust the cron expression as needed
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
