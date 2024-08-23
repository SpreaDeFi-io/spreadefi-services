export const SQUID_BASE_URL = 'https://apiplus.squidrouter.com';

export const ETHEREUM_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export const PORTALS_URL = 'https://api.portals.fi/v2';

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
