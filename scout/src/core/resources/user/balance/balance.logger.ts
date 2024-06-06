import { Logger } from '@nestjs/common';
import { BalanceService } from './balance.service';

export class BalanceLogger extends Logger {
  constructor() {
    super(BalanceService.name);
  }
}
