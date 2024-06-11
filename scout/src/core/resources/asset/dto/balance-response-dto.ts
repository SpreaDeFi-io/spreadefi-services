import { ApiProperty } from '@nestjs/swagger';
import { ScoutResponse } from 'src/common/interfaces/scout-response.interface';
import { BalanceListResponse } from 'src/common/types/balance';

export class BalanceResponseDto implements ScoutResponse {
  @ApiProperty({
    description: 'Response status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Fetched all assets balance of this address successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    example: [
      {
        assetAddress: '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8',
        protocolName: 'Aave',
        chainId: '10',
        currentATokenBalance: '10000000',
        currentStableDebt: '0',
        currentVariableDebt: '1232334',
      },
    ],
  })
  data: BalanceListResponse;
}
