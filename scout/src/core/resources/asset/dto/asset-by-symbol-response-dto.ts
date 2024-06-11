import { ApiProperty } from '@nestjs/swagger';
import { ScoutResponse } from 'src/common/interfaces/scout-response.interface';
import { GetAssetBySymbolListResponse } from 'src/common/types/asset';

export class AssetBySymbolResponseDto implements ScoutResponse {
  @ApiProperty({
    description: 'Response status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Fetched assets successfully by symbol',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    example: [
      {
        points: [],
        _id: '66472609c3ad53f41c05cfca',
        protocolName: 'Aave',
        chainId: '42161',
        assetName: 'Wrapped Ether',
        assetSymbol: 'WETH',
        assetAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        createdAt: '2024-05-17T09:40:25.435Z',
        updatedAt: '2024-06-07T12:32:50.325Z',
        __v: 0,
        assetId: 'Aave-WETH-42161',
        protocolType: 'Lending',
        assetSupplyApy: 2.185373033933284,
        assetSupplyBoostedApy: 0,
        assetBorrowApy: 2.927471661545186,
      },
      {
        points: [],
        _id: '664733b3953fc462e9535d5a',
        assetId: 'Aave-WETH-8453',
        protocolName: 'Aave',
        chainId: '8453',
        assetName: 'Wrapped Ether',
        assetSymbol: 'WETH',
        assetAddress: '0x4200000000000000000000000000000000000006',
        createdAt: '2024-05-17T10:38:43.511Z',
        updatedAt: '2024-06-07T12:32:50.325Z',
        __v: 0,
        protocolType: 'Lending',
        assetSupplyApy: 0.3926592979249542,
        assetSupplyBoostedApy: 0,
        assetBorrowApy: 1.4813077152393708,
      },
    ],
  })
  data: GetAssetBySymbolListResponse;
}
