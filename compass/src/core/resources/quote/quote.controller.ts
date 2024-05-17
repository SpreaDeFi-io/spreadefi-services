import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from 'src/core/resources/quote/dto/create-quote.dto';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createQuote(@Body() createQuoteDto: CreateQuoteDto) {
    const data = await this.quoteService.createQuote(createQuoteDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created quote successfully',
      data,
    };
  }
}
