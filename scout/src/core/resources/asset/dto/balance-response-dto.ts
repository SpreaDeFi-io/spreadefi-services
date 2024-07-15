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
    example: {
      filteredBalances: [
        {
          asset: {
            points: [],
            _id: '6647267ac3ad53f41c05cfce',
            protocolName: 'Aave',
            chainId: '42161',
            assetName: 'Wrapped BTC',
            assetSymbol: 'WBTC',
            assetAddress: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
            createdAt: '2024-05-17T09:42:18.288Z',
            updatedAt: '2024-07-12T06:30:00.856Z',
            __v: 0,
            assetId: 'Aave-WBTC-42161',
            protocolType: 'Lending',
            assetSupplyApy: 0.031147674505379162,
            assetSupplyBoostedApy: 0,
            assetBorrowApy: 0.5882901259429658,
          },
          protocol: 'Aave',
          chainId: '42161',
          currentATokenBalance: '45551695',
          currentStableDebt: '0',
          currentVariableDebt: '0',
        },
      ],
      assets: [
        {
          points: [],
          _id: '66472a794a029041aefb358b',
          assetId: 'Aave-LINK-42161',
          protocolName: 'Aave',
          chainId: '42161',
          assetName: 'ChainLink Token',
          assetSymbol: 'LINK',
          assetAddress: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
          createdAt: '2024-05-17T09:59:21.620Z',
          updatedAt: '2024-07-12T06:30:00.856Z',
          __v: 0,
          protocolType: 'Lending',
          assetSupplyApy: 0.021230976097171485,
          assetSupplyBoostedApy: 0,
          assetBorrowApy: 0.6425142295877803,
        },
        {
          points: [],
          _id: '66472b02953fc462e9535d50',
          assetId: 'Aave-USDC.e-42161',
          protocolName: 'Aave',
          chainId: '42161',
          assetName: 'Bridged USDC',
          assetSymbol: 'USDC.e',
          assetAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
          createdAt: '2024-05-17T10:01:38.287Z',
          updatedAt: '2024-07-12T06:30:00.856Z',
          __v: 0,
          protocolType: 'Lending',
          assetSupplyApy: 5.048118398177447,
          assetSupplyBoostedApy: 0,
          assetBorrowApy: 9.938741036669242,
        },
      ],
    },
  })
  data: BalanceListResponse;
}
