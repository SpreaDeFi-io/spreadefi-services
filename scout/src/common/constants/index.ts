import 'dotenv/config';

export const RPC_URLS = {
  '42161': process.env.ARB_RPC,
  '10': process.env.OP_RPC,
  '8453': process.env.BASE_RPC,
  '59144': process.env.LINEA_RPC,
};

export const DEFI_LLAMA_URI = 'https://yields.llama.fi';

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
};

export const chainToChainId = {
  Arbitrum: '42161',
  Optimism: '10',
  Base: '8453',
  Linea: '59144',
};
