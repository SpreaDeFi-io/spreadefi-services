import { Module } from '@nestjs/common';
import { EnsoController } from './enso.controller';
import { EnsoService } from './enso.service';

@Module({
  controllers: [EnsoController],
  providers: [EnsoService],
  exports: [EnsoService],
})
export class EnsoModule {}
