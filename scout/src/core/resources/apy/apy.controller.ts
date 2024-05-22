import { Controller } from '@nestjs/common';
import { ApyService } from './apy.service';

@Controller('apy')
export class ApyController {
  constructor(private readonly apyService: ApyService) {}
}
