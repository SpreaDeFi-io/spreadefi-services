import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from 'src/core/resources/asset/dto/create-asset.dto';
import { SerializeInterceptor } from 'interceptors/serialize.interceptor';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SerializeInterceptor)
  @Post()
  async createAsset(@Body() createAssetDto: CreateAssetDto) {
    const data = await this.assetService.createAsset(createAssetDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Created asset successfully',
      data,
    };
  }
}
