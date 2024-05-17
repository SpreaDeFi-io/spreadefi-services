import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateQuoteDto } from 'src/core/resources/quote/dto/create-quote.dto';
import { SquidService } from 'src/libs/squid/squid.service';

@Injectable()
export class QuoteService {
  constructor(
    private readonly squidService: SquidService,
    private readonly configService: ConfigService,
  ) {}

  async createQuote(createQuoteDto: CreateQuoteDto) {
    const quote = await this.squidService.createQuote(createQuoteDto);

    return quote;
  }
}
