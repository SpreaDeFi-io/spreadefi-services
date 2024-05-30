import { PortfolioService } from './portfolio.service';
import { Controller, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}
  @HttpCode(HttpStatus.OK)
  @Get('/:address')
  async getTotalBalance(@Param('address') address: string) {
    const data = await this.portfolioService.getTotalBalance(address);

    return {
      statusCode: HttpStatus.OK,
      message: 'Fetched balance successfully',
      data,
    };
  }
}
