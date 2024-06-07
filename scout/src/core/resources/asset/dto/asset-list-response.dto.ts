import { ApiProperty } from '@nestjs/swagger';
import { ScoutResponse } from 'src/common/interfaces/scout-response.interface';
import { TGetAssetListResponse } from 'src/common/types/asset';

export class AssetListResponseDto implements ScoutResponse {
  @ApiProperty({
    description: 'Response status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Fetched asset successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    example: {
      points: [['2X LP Points', '1X Zerolend Points']],
      chainIds: ['42161', '10'],
      protocolNames: ['Aave', 'Seamless'],
      assetSupplyApys: [1.4, 2.1],
      assetSupplyBoostedApys: [22, 9.7],
      assetSymbol: 'USDC',
      protocolType: 'Lending',
    },
  })
  data: TGetAssetListResponse;
}
