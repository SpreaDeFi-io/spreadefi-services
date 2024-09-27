import { StrategyName } from '../types';

export const SQUID_BASE_URL = 'https://apiplus.squidrouter.com';

export const ETHEREUM_ADDRESS_SQUID =
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const ETHEREUM_ADDRESS_LIFI =
  '0x0000000000000000000000000000000000000000';

export const PORTALS_URL = 'https://api.portals.fi/v2';

export const ENSO_URL = 'https://api.enso.finance/api/v1';

export const LIFI_URL = 'https://li.quest/v1';

export const SQUID_MULTICALL_CONTRACT =
  '0xEa749Fd6bA492dbc14c24FE8A3d08769229b896c';

export const protocolOnChains = {
  Aave: {
    chains: ['10', '8453', '42161', '534352'],
  },
  Seamless: {
    chains: ['8453'],
  },
  Zerolend: {
    chains: ['59144'],
  },
  Hop: {
    chains: ['10', '42161'],
  },
};

export const chainIdToChainPortals = {
  '42161': 'arbitrum',
  '10': 'optimism',
  '8453': 'base',
  '56': 'bsc',
  '137': 'polygon',
  '250': 'fantom',
  '43114': 'avalanche',
};

export const chainToChainIdPortals = {
  arbitrum: '42161',
  optimism: '10',
  base: '8453',
  bsc: '56',
  polygon: '137',
  fantom: '250',
  avalanche: '43114',
};

export const PORTALS_ENSO_SUPPORTED_PROTOCOLS = [
  StrategyName.YEARN_V3,
  StrategyName.PENDLE,
  StrategyName.BEEFY,
  StrategyName.HARVEST_FINANCE,
  StrategyName.YEARN,
  StrategyName.STARGATE,
  StrategyName.BENQI,
];

export const PORTALS_ENSO_MIGRATION_PROTOCOLS = [
  StrategyName.YEARN_V3_PENDLE,
  StrategyName.PENDLE_YEARN_V3,
  StrategyName.PENDLE_BEEFY,
  StrategyName.BEEFY_PENDLE,
  StrategyName.YEARN_V3_BEEFY,
  StrategyName.BEEFY_YEARN_V3,
  StrategyName.HARVEST_FINANCE_BEEFY,
  StrategyName.HARVEST_FINANCE_PENDLE,
  StrategyName.HARVEST_FINANCE_YEARN_V3,
  StrategyName.BEEFY_HARVEST_FINANCE,
  StrategyName.PENDLE_HARVEST_FINANCE,
  StrategyName.YEARN_V3_HARVEST_FINANCE,
  StrategyName.YEARN_PENDLE,
  StrategyName.YEARN_BEEFY,
  StrategyName.YEARN_HARVEST_FINANCE,
  StrategyName.PENDLE_YEARN,
  StrategyName.BEEFY_YEARN,
  StrategyName.HARVEST_FINANCE_YEARN,
  StrategyName.STARGATE_YEARN,
  StrategyName.YEARN_STARGATE,
  StrategyName.STARGATE_PENDLE,
  StrategyName.PENDLE_STARGATE,
  StrategyName.STARGATE_YEARN_V3,
  StrategyName.YEARN_V3_STARGATE,
  StrategyName.HARVEST_FINANCE_STARGATE,
  StrategyName.STARGATE_HARVEST_FINANCE,
  StrategyName.STARGATE_BEEFY,
  StrategyName.BEEFY_STARGATE,
  StrategyName.BENQI_STARGATE,
  StrategyName.STARGATE_BENQI,
  StrategyName.BENQI_YEARN,
  StrategyName.YEARN_BENQI,
  StrategyName.BENQI_YEARN_V3,
  StrategyName.YEARN_V3_BENQI,
  StrategyName.BENQI_HARVEST_FINANCE,
  StrategyName.HARVEST_FINANCE_BENQI,
  StrategyName.BENQI_PENDLE,
  StrategyName.PENDLE_BENQI,
];

export const LIFI_CHAINS = [
  // {
  //   name: 'Scroll',
  //   chainId: '534352',
  // },
];
