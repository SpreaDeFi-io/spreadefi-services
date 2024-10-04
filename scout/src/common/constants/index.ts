import 'dotenv/config';

export const RPC_URLS = {
  '42161': process.env.ARB_RPC,
  '10': process.env.OP_RPC,
  '8453': process.env.BASE_RPC,
  '59144': process.env.LINEA_RPC,
  '56': process.env.BSC_RPC,
  '137': process.env.POLYGON_RPC,
  '250': process.env.FANTOM_RPC,
  '43114': process.env.AVALANCHE_RPC,
  '534352': process.env.SCROLL_RPC,
  '81457': process.env.BLAST_RPC,
  '1088': process.env.METIS_RPC,
};

export const DEFI_LLAMA_URI = 'https://yields.llama.fi';

export const PORTALS_URL = 'https://api.portals.fi/v2';

export const PORTALS_PLATFORMS = [
  'yearn-v3',
  'pendle',
  'beefy',
  'harvest-finance',
  'yearn',
  'stargate',
  'benqi',
];

export const PORTALS_BALANCE = [
  'yearn-v3',
  'beefy',
  'pendle',
  'harves-finance',
  'yearn',
  'stargate',
  'benqi',
];

export const DEFI_LLAMA_POOLS = [
  {
    asset: 'WETH',
    chainId: '42161',
    chain: 'Arbitrum',
    pool: '040a047e-6905-400e-af3a-eeb7e565c15a',
  },
  {
    asset: 'WETH',
    chainId: '10',
    chain: 'Optimism',
    pool: '10f40e8a-e74c-4448-a097-f2f9f0a72e8c',
  },
  {
    asset: 'rETH',
    chainId: '42161',
    chain: 'Arbitrum',
    pool: 'd79bdec3-56bc-4cdf-9fed-d6a7eaa8d2d4',
  },
  {
    asset: 'DAI',
    chainId: '10',
    chain: 'Optimism',
    pool: 'a83ea746-1cc2-44ef-ab91-3fc0459ff6d1',
  },
  {
    asset: 'DAI',
    chainId: '42161',
    chain: 'Arbitrum',
    pool: 'b0c1ee55-9855-436b-bca4-65626ec70c3d',
  },
];

export const CHAINS = {
  ARB: 42161,
  OP: 10,
  BASE: 8453,
  LINEA: 59144,
  BSC: 56,
  POLYGON: 137,
  FANTOM: 250,
  AVALANCHE: 43114,
  SCROLL: 534352,
  BLAST: 81457,
  METIS: 1088,
};

export const chainToChainId = {
  Arbitrum: '42161',
  Optimism: '10',
  Base: '8453',
  Linea: '59144',
  BSC: '56',
  POLYGON: '137',
  FANTOM: '250',
  AVALANCHE: '43114',
  SCROLL: '534352',
  BLAST: '81457',
  METIS: '1088',
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
