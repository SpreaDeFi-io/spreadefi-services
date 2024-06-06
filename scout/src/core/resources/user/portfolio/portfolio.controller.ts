import { PortfolioService } from './portfolio.service';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { SerializeInterceptor } from 'interceptors/serialize.interceptor';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SerializeInterceptor)
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
