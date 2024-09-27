import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  CreateSquidQuoteDto,
  CreateSquidQuoteResponseDto,
} from 'src/core/resources/quote/dto/create-squid-quote.dto';
import {
  PrepareTransactionDto,
  PrepareTransactionResponseDto,
} from './dto/prepare-transaction.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiSendCreatedResponse } from 'src/common/decorators/swagger/response.decorator';
import { SerializeInterceptor } from 'interceptors/serialize.interceptor';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiSendCreatedResponse(
    'Returns created response after successfully creating transactions',
    PrepareTransactionResponseDto,
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('prepare')
  @UseInterceptors(SerializeInterceptor)
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

  @ApiSendCreatedResponse(
    'Returns created response after successfully creating quote',
    CreateSquidQuoteResponseDto,
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('squid/quote')
  @UseInterceptors(SerializeInterceptor)
  async createQuote(@Body() createQuoteDto: CreateSquidQuoteDto) {
    const data = await this.transactionService.createQuote(createQuoteDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Created quote successfully',
      data,
    };
  }
}
