import { Injectable } from '@nestjs/common';
import { BalanceService } from '../balance/balance.service';

@Injectable()
export class PortfolioService {
  constructor(private readonly balanceService: BalanceService) {}
}
