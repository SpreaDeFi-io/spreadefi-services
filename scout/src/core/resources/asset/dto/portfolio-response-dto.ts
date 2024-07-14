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
        chainBalance: {
          '10': {
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': {
              balance: '4260334407999231',
              price: '$13.60',
            },
          },
          '8453': {
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': {
              balance: '0',
              price: '$0.00',
            },
          },
          '42161': {
            '0x078f358208685046a11c85e8ad32895ded33a249': {
              balance: '45551695',
              price: '$27,375.21',
            },
          },
          '59144': {
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': {
              balance: '0',
              price: '$0.00',
            },
          },
        },
        aaveBalances: {
          '10': [
            '0',
            '0',
            '0',
            '0',
            '0',
            '115792089237316195423570985008687907853269984665640564039457584007913129639935',
          ],
        },
        seamlessBalances: {
          '8453': [
            '0',
            '0',
            '0',
            '0',
            '0',
            '115792089237316195423570985008687907853269984665640564039457584007913129639935',
          ],
        },
        zerolendBalances: {
          '59144': [
            '0',
            '0',
            '0',
            '0',
            '0',
            '115792089237316195423570985008687907853269984665640564039457584007913129639935',
          ],
        },
      },
    ],
  })
  data: PortfolioListResponse;
}
