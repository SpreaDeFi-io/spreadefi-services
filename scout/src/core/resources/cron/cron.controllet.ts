// src/cron/cron.controller.ts
import { Controller, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { CronService } from './cron.service';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('trigger')
  async triggerCron() {
    await this.cronService.manualCron();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Update asset apy successfully',
    };
  }
}
