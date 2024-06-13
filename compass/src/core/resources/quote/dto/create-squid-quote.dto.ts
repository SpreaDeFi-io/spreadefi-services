import { RouteResponse } from '@0xsquid/squid-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSquidQuoteDto {
  @ApiProperty({
    description: 'From Chain Id',
    example: '10',
  })
  @IsString()
  @IsNotEmpty()
  fromChain: string;

  @ApiProperty({
    description: 'From Amount',
    example: '100000000',
  })
  @IsString()
  @IsNotEmpty()
  fromAmount: string;

  @ApiProperty({
    description: 'From Token',
    example: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  })
  @IsString()
  @Length(42, 42)
  @IsNotEmpty()
  fromToken: string;

  @ApiProperty({
    description: 'To Chain Id',
    example: '42161',
  })
  @IsString()
  @IsNotEmpty()
  toChain: string;

  @ApiProperty({
    description: 'To Token',
    example: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  })
  @IsString()
  @Length(42, 42)
  @IsNotEmpty()
  toToken: string;

  @ApiProperty({
    description: 'From Address',
    example: '0xf9739cF1B992E62a1C5c18C33cacb2a27a91F888',
  })
  @IsString()
  @Length(42, 42)
  @IsNotEmpty()
  fromAddress: string;

  @ApiProperty({
    description: 'To Address',
    example: '0x22f4B00bdb090bb7bb8e12b86e541e859C0622D6',
  })
  @IsString()
  @Length(42, 42)
  @IsNotEmpty()
  toAddress: string;
}

export class CreateSquidQuoteResponseDto {
  @ApiProperty({
    description: 'Response status code',
    example: 201,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Created quote successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    example: {
      estimate: {
        actions: [
          {
            type: 'swap',
            chainType: 'evm',
            data: {
              address: '0x2aB22ac86b25BD448A4D9dC041Bd2384655299c4',
              chainId: '10',
              dex: 'Uniswap-v3',
              enabled: true,
              fee: 0.01,
              liquidity: 63990188126000,
              poolFee: '100',
              poolId: '0x2aB22ac86b25BD448A4D9dC041Bd2384655299c4',
              tokenAddresses: [
                '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
                '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
              ],
              path: [
                '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
                '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
              ],
              slippage: 0.006,
              custom: {
                swapGasEstimate: '81681',
              },
              target: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
            },
            fromChain: '10',
            toChain: '10',
            fromToken: {
              type: 'evm',
              chainId: '10',
              address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
              name: 'USD Coin',
              symbol: 'USDC',
              decimals: 6,
              logoURI:
                'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
              coingeckoId: 'usd-coin',
              subGraphIds: ['uusdc', 'cctp-uusdc-optimism-to-noble'],
              usdPrice: 0.999114,
            },
            toToken: {
              type: 'evm',
              chainId: '10',
              address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
              name: 'USD Coin (Bridged from Ethereum)',
              symbol: 'USDC.e',
              decimals: 6,
              logoURI:
                'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
              coingeckoId: 'usd-coin',
              usdPrice: 0.999114,
            },
            fromAmount: '100000000',
            toAmount: '99996849',
            toAmountMin: '99396867',
            exchangeRate: '0.99996849',
            priceImpact: '-0.02',
            stage: 0,
            provider: 'Uniswap-v3',
            description: 'Swap from USDC to USDC.e',
          },
          {
            type: 'swap',
            chainType: 'evm',
            data: {
              address: '0xA8a5356ee5d02Fe33d72355e4F698782F8f199e8',
              chainId: '10',
              dex: 'Uniswap-v3',
              enabled: true,
              fee: 0.01,
              liquidity: 25460261297200,
              poolFee: '100',
              poolId: '0xA8a5356ee5d02Fe33d72355e4F698782F8f199e8',
              tokenAddresses: [
                '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
                '0xeb466342c4d449bc9f53a865d5cb90586f405215',
              ],
              path: [
                '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
                '0xeb466342c4d449bc9f53a865d5cb90586f405215',
              ],
              slippage: 0.006,
              custom: {
                swapGasEstimate: '67654',
              },
              target: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
            },
            fromChain: '10',
            toChain: '10',
            fromToken: {
              type: 'evm',
              chainId: '10',
              address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
              name: 'USD Coin (Bridged from Ethereum)',
              symbol: 'USDC.e',
              decimals: 6,
              logoURI:
                'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
              coingeckoId: 'usd-coin',
              usdPrice: 0.999114,
            },
            toToken: {
              type: 'evm',
              chainId: '10',
              address: '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
              name: 'Axelar USDC',
              symbol: 'axlUSDC',
              axelarNetworkSymbol: 'axlUSDC',
              decimals: 6,
              logoURI:
                'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
              coingeckoId: 'axlusdc',
              subGraphIds: ['uusdc'],
              usdPrice: 0.998472,
            },
            fromAmount: '99996849',
            toAmount: '99981440',
            toAmountMin: '99381551',
            exchangeRate: '0.999845905144471102',
            priceImpact: '-0.01',
            stage: 0,
            provider: 'Uniswap-v3',
            description: 'Swap from USDC.e to axlUSDC',
          },
          {
            type: 'bridge',
            chainType: 'evm',
            data: {
              name: 'uusdc',
              provider: 'axelar',
              type: 'gmp',
            },
            fromChain: '10',
            toChain: '42161',
            fromToken: {
              type: 'evm',
              chainId: '10',
              address: '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
              name: 'Axelar USDC',
              symbol: 'axlUSDC',
              axelarNetworkSymbol: 'axlUSDC',
              decimals: 6,
              logoURI:
                'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
              coingeckoId: 'axlusdc',
              subGraphIds: ['uusdc'],
              usdPrice: 0.998472,
            },
            toToken: {
              type: 'evm',
              chainId: '42161',
              address: '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
              name: 'Axelar USDC',
              symbol: 'axlUSDC',
              axelarNetworkSymbol: 'axlUSDC',
              decimals: 6,
              logoURI:
                'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
              coingeckoId: 'axlusdc',
              subGraphIds: ['uusdc'],
              subGraphOnly: false,
              usdPrice: 0.998472,
            },
            fromAmount: '99981440',
            toAmount: '99981440',
            toAmountMin: '99981440',
            exchangeRate: '1.0',
            priceImpact: '0.0',
            stage: 0,
            provider: 'axelar',
            description: 'Bridge axlUSDC to axlUSDC on Arbitrum',
          },
          {
            type: 'swap',
            chainType: 'evm',
            data: {
              address: '0xaEeCeeC4B31d3c1057210115bf176Ebb05b9805D',
              chainId: '42161',
              dex: 'Uniswap-v3',
              enabled: true,
              fee: 0.01,
              liquidity: 22971006688000,
              poolFee: 100,
              poolId: '0xaEeCeeC4B31d3c1057210115bf176Ebb05b9805D',
              tokenAddresses: [
                '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                '0xeb466342c4d449bc9f53a865d5cb90586f405215',
              ],
              path: [
                '0xeb466342c4d449bc9f53a865d5cb90586f405215',
                '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
              ],
              slippage: 0.006,
              custom: {
                swapGasEstimate: '81620',
              },
              target: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
            },
            fromChain: '42161',
            toChain: '42161',
            fromToken: {
              type: 'evm',
              chainId: '42161',
              address: '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
              name: 'Axelar USDC',
              symbol: 'axlUSDC',
              axelarNetworkSymbol: 'axlUSDC',
              decimals: 6,
              logoURI:
                'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
              coingeckoId: 'axlusdc',
              subGraphIds: ['uusdc'],
              subGraphOnly: false,
              usdPrice: 0.998472,
            },
            toToken: {
              type: 'evm',
              chainId: '42161',
              address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
              name: 'USD Coin',
              symbol: 'USDC.e',
              decimals: 6,
              logoURI:
                'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
              coingeckoId: 'usd-coin',
              usdPrice: 0.999114,
            },
            fromAmount: '99981440',
            toAmount: '99955275',
            toAmountMin: '99355543',
            exchangeRate: '0.999738301428745175',
            priceImpact: '-0.01',
            stage: 1,
            provider: 'Uniswap-v3',
            description: 'Swap from axlUSDC to USDC.e',
          },
          {
            type: 'swap',
            chainType: 'evm',
            data: {
              address: '0xc86Eb7B85807020b4548EE05B54bfC956eEbbfCD',
              chainId: '42161',
              dex: 'Camelot',
              enabled: true,
              fee: 0.005,
              liquidity: 184440432250800,
              poolFee: 50,
              poolId: '0xc86Eb7B85807020b4548EE05B54bfC956eEbbfCD',
              tokenAddresses: [
                '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
              ],
              path: [
                '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
              ],
              slippage: 0.006,
              target: '0x1F721E2E82F6676FCE4eA07A5958cF098D339e18',
            },
            fromChain: '42161',
            toChain: '42161',
            fromToken: {
              type: 'evm',
              chainId: '42161',
              address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
              name: 'USD Coin',
              symbol: 'USDC.e',
              decimals: 6,
              logoURI:
                'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
              coingeckoId: 'usd-coin',
              usdPrice: 0.999114,
            },
            toToken: {
              type: 'evm',
              chainId: '42161',
              address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
              name: 'USD Coin',
              symbol: 'USDC',
              decimals: 6,
              logoURI:
                'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
              coingeckoId: 'usd-coin',
              subGraphIds: ['uusdc', 'cctp-uusdc-arbitrum-to-noble'],
              usdPrice: 0.999114,
            },
            fromAmount: '99955275',
            toAmount: '99952305',
            toAmountMin: '99352591',
            exchangeRate: '0.999970286710731374',
            priceImpact: '-0.02',
            stage: 1,
            provider: 'Camelot',
            description: 'Swap from USDC.e to USDC',
          },
        ],
        fromAmount: '100000000',
        toAmount: '99952305',
        toAmountMin: '99352591',
        sendAmount: '100000000',
        exchangeRate: '0.99952305',
        aggregatePriceImpact: '-0.06',
        estimatedRouteDuration: 20,
        aggregateSlippage: 2.4,
        fromToken: {
          type: 'evm',
          chainId: '10',
          address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 6,
          logoURI:
            'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
          coingeckoId: 'usd-coin',
          subGraphIds: ['uusdc', 'cctp-uusdc-optimism-to-noble'],
          usdPrice: 0.999661,
        },
        toToken: {
          type: 'evm',
          chainId: '42161',
          address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 6,
          logoURI:
            'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdc.svg',
          coingeckoId: 'usd-coin',
          subGraphIds: ['uusdc', 'cctp-uusdc-arbitrum-to-noble'],
          usdPrice: 0.999661,
        },
        isBoostSupported: true,
        feeCosts: [
          {
            name: 'Gas Receiver Fee',
            description: 'Gas receiver fee',
            token: {
              type: 'evm',
              chainId: '10',
              address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
              logoURI:
                'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg',
              coingeckoId: 'ethereum',
            },
            gasLimit: '1327709',
            gasMultiplier: 1.32,
            amount: '67096858542776',
            amountUsd: '0.24',
          },
          {
            name: 'Axelar Fee',
            description: 'Boost fee',
            token: {
              type: 'evm',
              chainId: '10',
              address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
              logoURI:
                'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg',
              coingeckoId: 'ethereum',
            },
            amount: '0',
            amountUsd: '0.00',
          },
        ],
        gasCosts: [
          {
            type: 'executeCall',
            token: {
              type: 'evm',
              chainId: '10',
              address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
              logoURI:
                'https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg',
              coingeckoId: 'ethereum',
            },
            amount: '1539899670839409',
            gasLimit: '985837',
            amountUsd: '',
          },
        ],
        fromAmountUSD: '99.96',
        toAmountUSD: '99.91',
        toAmountMinUSD: '99.31',
      },
      transactionRequest: {
        routeType: 'CALL_BRIDGE_CALL',
        target: '0xce16F69375520ab01377ce7B88f5BA8C48F8D666',
        data: '0x846a1bc60000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff850000000000000000000000000000000000000000000000000000000005f5e100000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000940000000000000000000000000000000000000000000000000000000000000098000000000000000000000000000000000000000000000000000000000000009e0000000000000000000000000f9739cf1b992e62a1c5c18c33cacb2a27a91f8880000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000042000000000000000000000000000000000000000000000000000000000000005a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff85000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b300000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc450000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff850000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff850000000000000000000000007f5c764cbc14f9669b88837ca1490cca17c316070000000000000000000000000000000000000000000000000000000000000064000000000000000000000000ea749fd6ba492dbc14c24fe8a3d08769229b896c0000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000000000000000000000000000000000000005ecad0300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff85000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000010000000000000000000000007f5c764cbc14f9669b88837ca1490cca17c31607000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b300000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc4500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000007f5c764cbc14f9669b88837ca1490cca17c316070000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000007f5c764cbc14f9669b88837ca1490cca17c31607000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f4052150000000000000000000000000000000000000000000000000000000000000064000000000000000000000000ce16f69375520ab01377ce7b88f5ba8c48f8d6660000000000000000000000000000000000000000000000000000000005f5d4b10000000000000000000000000000000000000000000000000000000005ec712f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000007f5c764cbc14f9669b88837ca1490cca17c316070000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000761786c55534443000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008417262697472756d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a307863653136463639333735353230616230313337376365374238386635424138433438463844363636000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000940000000000000000000000000000000000000000000000000000000000000004000000000000000000000000022f4b00bdb090bb7bb8e12b86e541e859c0622d6000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000054000000000000000000000000000000000000000000000000000000000000006c000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f4052150000000000000000000000000000000000000000000000000000000000000001000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f405215000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b300000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc450000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f4052150000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f405215000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc80000000000000000000000000000000000000000000000000000000000000064000000000000000000000000ea749fd6ba492dbc14c24fe8a3d08769229b896c0000000000000000000000000000000000000000000000000000000005f598800000000000000000000000000000000000000000000000000000000005ec0b970000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f40521500000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000044095ea7b30000000000000000000000001f721e2e82f6676fce4ea07a5958cf098d339e180000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc8000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000001f721e2e82f6676fce4ea07a5958cf098d339e18000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000e4bc651188000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc8000000000000000000000000af88d065e77c8cc2239327c5edb3a432268e583100000000000000000000000022f4b00bdb090bb7bb8e12b86e541e859c0622d60000000000000000000000000000000000000000000000000000019006b9c0b80000000000000000000000000000000000000000000000000000000005f5324b0000000000000000000000000000000000000000000000000000000005ec000f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000ff970a61a04b1ca14834a43f5de4533ebddb5cc80000000000000000000000000000000000000000000000000000000000000004',
        value: '67096858542776',
        gasLimit: '985837',
        gasPrice: '61826063',
        maxFeePerGas: '1621652126',
        maxPriorityFeePerGas: '1500000000',
      },
      params: {
        fromChain: '10',
        toChain: '42161',
        fromToken: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
        toToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        fromAmount: '100000000',
        fromAddress: '0xf9739cF1B992E62a1C5c18C33cacb2a27a91F888',
        toAddress: '0x22f4B00bdb090bb7bb8e12b86e541e859C0622D6',
        slippageConfig: {
          autoMode: 1,
        },
        enableBoost: true,
        prefer: [],
      },
    },
  })
  data: RouteResponse;
}
