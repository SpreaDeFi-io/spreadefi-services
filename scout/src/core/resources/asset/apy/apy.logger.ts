import { Logger } from '@nestjs/common';
import { ApyService } from './apy.service';

export class ApyLogger extends Logger {
  constructor() {
    super(ApyService.name);
  }
}
