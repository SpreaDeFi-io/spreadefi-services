import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateSquidQuoteDto } from 'src/core/resources/quote/dto/create-squid-quote.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly quoteService: TransactionService) {}

  @Post('prepare')
  async prepareTransaction() {}

  @HttpCode(HttpStatus.CREATED)
  @Post('squid/quote')
  async createQuote(@Body() createQuoteDto: CreateSquidQuoteDto) {
    const data = await this.quoteService.createQuote(createQuoteDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created quote successfully',
      data,
    };
  }
}
