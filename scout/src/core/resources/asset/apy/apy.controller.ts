import { Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApyService } from './apy.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('asset apy')
@Controller('apy')
export class ApyController {
  constructor(private readonly apyService: ApyService) {}

  @HttpCode(HttpStatus.OK)
  @Patch()
  async updateApy() {
    const data = await this.apyService.updateApy();

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully updated APY',
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/hop')
  async updateApyHop() {
    const data = await this.apyService.updateHopBeefyApy();

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully updated APY',
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/portals')
  async updateApyPortals() {
    const data = await this.apyService.upadtePortalsApy();

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully updated APY',
      data,
    };
  }
}
