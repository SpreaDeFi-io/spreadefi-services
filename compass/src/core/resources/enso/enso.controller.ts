import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { EnsoService } from './enso.service';
import { CreateRouteDto } from './dto/create-route.dto';

@Controller('enso')
export class EnsoController {
  constructor(private readonly ensoService: EnsoService) {}

  @HttpCode(HttpStatus.OK)
  @Get('quote')
  async getQuote(
    @Query('sender') sender: string,
    @Query('chainId') chainId: string,
    @Query('fromToken') fromToken: string,
    @Query('fromAmount') fromAmount: string,
    @Query('toToken') toToken: string,
  ) {
    const data = await this.ensoService.getQuote(
      sender,
      chainId,
      fromToken,
      fromAmount,
      toToken,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Created quote successfully',
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('route')
  async createRoute(@Body() createRouteDto: CreateRouteDto) {
    const data = await this.ensoService.createExecutableTransaction(
      createRouteDto.sender,
      createRouteDto.chainId,
      createRouteDto.receiver,
      createRouteDto.inputToken,
      createRouteDto.inputAmount,
      createRouteDto.outputToken,
      createRouteDto.toEOA,
      createRouteDto?.slippage,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Created route successfully',
      data,
    };
  }
}
