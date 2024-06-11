import { PortfolioService } from './portfolio.service';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SerializeInterceptor } from 'interceptors/serialize.interceptor';
import { ApiSendOkResponse } from 'src/common/decorators/swagger/response.decorator';
import { PortfolioResponseDto } from '../../asset/dto/portfolio-response-dto';

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}
  @ApiSendOkResponse(
    'Returns ok response after successfully fetching total collateral and debt, wallet balance of a address',
    PortfolioResponseDto,
  )
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SerializeInterceptor)
  @Get('/:address')
  async getTotalBalance(@Param('address') address: string) {
    const data = await this.portfolioService.getTotalBalance(address);

    return {
      statusCode: HttpStatus.OK,
      message:
        'Fetched total collateral and debt, wallet balance of this address successfully',
      data,
    };
  }
}
