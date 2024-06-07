import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Get,
  Param,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from 'src/core/resources/asset/dto/create-asset.dto';
import { SerializeInterceptor } from 'interceptors/serialize.interceptor';
import { ApiSendOkResponse } from 'src/common/decorators/swagger/response.decorator';
import { AssetListResponseDto } from './dto/asset-list-response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('asset')
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @ApiSendOkResponse(
    'Returns ok response after successfully fetching assets',
    AssetListResponseDto,
  )
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAssets() {
    const data = await this.assetService.getAssets();
    return {
      statusCode: HttpStatus.OK,
      message: 'Fetched assets successfully',
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('symbol/:symbol')
  async getAssetBySymbol(@Param('symbol') symbol: string) {
    const data = await this.assetService.getAssetBySymbol(symbol);

    return {
      statusCode: HttpStatus.OK,
      message: 'Fetched asset successfully',
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('id/:id')
  async getAssetById(@Param('id') id: string) {
    const data = await this.assetService.getAssetById(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Fetched asset successfully',
      data,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(SerializeInterceptor)
  @Post()
  async createAsset(@Body() createAssetDto: CreateAssetDto) {
    const data = await this.assetService.createAsset(createAssetDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created asset successfully',
      data,
    };
  }
}
