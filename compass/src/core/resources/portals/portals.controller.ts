import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { PortalsService } from './portals.service';
import { ApiTags } from '@nestjs/swagger';
import { SimulateTransactionDto } from './dto/simulate-transaction.dto';

@ApiTags('portals')
@Controller('portals')
export class PortalsController {
  constructor(private readonly portalsService: PortalsService) {}

  @HttpCode(HttpStatus.OK)
  @Get('tokens')
  async getPortalsTokens(
    @Query('network') network: string,
    @Query('platform') platform: string,
  ) {
    const data = await this.portalsService.getTokens(network, platform);

    return {
      statusCode: HttpStatus.OK,
      message: 'Fetched tokens successfully',
      data,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/simulate')
  async simulatePortalsTransaction(
    @Body() simulateTransactionDto: SimulateTransactionDto,
  ) {
    const data = await this.portalsService.simulateTransaction(
      simulateTransactionDto.sender,
      simulateTransactionDto.network,
      simulateTransactionDto.inputToken,
      simulateTransactionDto.inputAmount,
      simulateTransactionDto.outputToken,
      simulateTransactionDto.slippage,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create simulated transaction',
      data,
    };
  }
}
