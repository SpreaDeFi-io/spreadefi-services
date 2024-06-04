import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { BalanceModule } from '../balance/balance.module';
import { PortfolioLogger } from './portfolio.logger';
import { CovalentService } from 'src/libs/covalent/covalent.service';

@Module({
  imports: [BalanceModule],
  controllers: [PortfolioController],
  providers: [PortfolioService, PortfolioLogger, CovalentService],
})
export class PortfolioModule {}
