import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateSquidQuoteDto } from 'src/core/resources/quote/dto/create-squid-quote.dto';
import { PrepareTransactionDto } from './dto/prepare-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('prepare')
  async prepareTransaction(
    @Body() prepareTransactionDto: PrepareTransactionDto,
  ) {
    const data = await this.transactionService.prepareTransaction(
      prepareTransactionDto,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created transactions successfully',
      data,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('squid/quote')
  async createQuote(@Body() createQuoteDto: CreateSquidQuoteDto) {
    const data = await this.transactionService.createQuote(createQuoteDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created quote successfully',
      data,
    };
  }
}
