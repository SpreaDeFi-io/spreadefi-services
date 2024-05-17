import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { SquidModule } from 'src/libs/squid/squid.module';

@Module({
  imports: [SquidModule.register()],
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}
