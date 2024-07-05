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
import { ApiTags } from '@nestjs/swagger';
import { ApiSendOkResponse } from 'src/common/decorators/swagger/response.decorator';
import {
  BalanceResponseDto,
  SpecificProtocolBalanceResponseDto,
} from '../../asset/dto/balance-response-dto';

@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}
  @ApiSendOkResponse(
    'Returns ok response after successfully fetching all assets balance of a address',
    BalanceResponseDto,
  )
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SerializeInterceptor)
  @Get('/:address')
  async getTotalBalance(@Param('address') address: string) {
    const data = await this.balanceService.getUserAssetBalances(address);

    return {
      statusCode: HttpStatus.OK,
      message: 'Fetched all assets balance of this address successfully',
      data,
    };
  }

  @ApiSendOkResponse(
    'Returns ok response after successfully fetching all assets balance of a specific chain of aprotocol',
    SpecificProtocolBalanceResponseDto,
  )
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SerializeInterceptor)
  @Get('/:address/:protocolName/:chainId')
  async getSpecificProtocolBalance(
    @Param('address') address: string,
    @Param('protocolName') protocolName: string,
    @Param('chainId') chainId: string,
  ) {
    const data = await this.balanceService.getUserSpecificProtocolBalances(
      address,
      protocolName,
      chainId,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Fetched all assets balance of this address successfully',
      data,
    };
  }
}
