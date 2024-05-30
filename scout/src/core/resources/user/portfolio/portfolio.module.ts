import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { BalanceModule } from '../balance/balance.module';
import { PortfolioLogger } from './portfolio.logger';

@Module({
  imports: [BalanceModule],
  controllers: [PortfolioController],
  providers: [PortfolioService, PortfolioLogger],
})
export class PortfolioModule {}
