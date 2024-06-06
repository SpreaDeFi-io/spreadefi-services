import { Logger } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

export class PortfolioLogger extends Logger {
  constructor() {
    super(PortfolioService.name);
  }
}
