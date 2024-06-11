import { ApiProperty } from '@nestjs/swagger';
import { ScoutResponse } from 'src/common/interfaces/scout-response.interface';
import { PortfolioListResponse } from 'src/common/types/portfolio';

export class PortfolioResponseDto implements ScoutResponse {
  @ApiProperty({
    description: 'Response status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example:
      'Fetched total collateral and debt, wallet balance of this address successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    example: [
      {
        totalCollateralBase: '1000000000',
        totalDebtBase: '5000000',
        totalBalanceUSD: '1000',
      },
    ],
  })
  data: PortfolioListResponse;
}
