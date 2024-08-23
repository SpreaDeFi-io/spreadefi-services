import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SimulateTransactionDto {
  @IsString()
  sender: string;

  @IsString()
  network: string;

  @IsString()
  inputToken: string;

  @IsString()
  inputAmount: string;

  @IsString()
  outputToken: string;

  @IsNumber()
  @IsOptional()
  slippage?: number;
}
