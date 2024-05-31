import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { SerializeInterceptor } from 'interceptors/serialize.interceptor';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SerializeInterceptor)
  @Get('/:address/:symbol')
  async getTotalBalance(
    @Param('address') address: string,
    @Param('symbol') symbol: string,
  ) {
    const data = await this.balanceService.getAssetBalance(address, symbol);

    return {
      statusCode: HttpStatus.OK,
      message: 'Fetched asset balance successfully',
      data,
    };
  }
}
