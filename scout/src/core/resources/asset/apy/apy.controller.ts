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
      httpStatus: HttpStatus.OK,
      message: 'Successfully updated APY',
      data,
    };
  }
}
