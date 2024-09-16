import { StrategyName } from '../types';

export const SQUID_BASE_URL = 'https://apiplus.squidrouter.com';

export const ETHEREUM_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const PORTALS_URL = 'https://api.portals.fi/v2';

export const ENSO_URL = 'https://api.enso.finance/api/v1';

export const SQUID_MULTICALL_CONTRACT =
  '0xEa749Fd6bA492dbc14c24FE8A3d08769229b896c';

export const protocolOnChains = {
  Aave: {
    chains: ['10', '8453', '42161'],
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
};

export const chainToChainIdPortals = {
  arbitrum: '42161',
  optimism: '10',
  base: '8453',
};

export const PORTALS_ENSO_SUPPORTED_PROTOCOLS = [
  StrategyName.YEARN_V3,
  StrategyName.PENDLE,
  StrategyName.BEEFY,
];

export const PORTALS_ENSO_MIGRATION_PROTOCOLS = [
  StrategyName.YEARN_V3_PENDLE,
  StrategyName.PENDLE_YEARN_V3,
  StrategyName.PENDLE_BEEFY,
  StrategyName.BEEFY_PENDLE,
  StrategyName.YEARN_V3_BEEFY,
  StrategyName.BEEFY_YEARN_V3,
];
