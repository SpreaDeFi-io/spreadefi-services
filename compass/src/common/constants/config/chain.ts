import 'dotenv/config';

export const chains = {
  '42161': {
    name: 'ARB',
    rpc: process.env.ARB_RPC,
    chainId: 42161,
    wstETHAddress: '0x5979D7b546E38E414F7E9822514be443A4800529',
    wethAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    usdtAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    daiAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    rethAddress: '0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8',
  },
  '8453': {
    name: 'BASE',
    rpc: process.env.BASE_RPC,
    chainId: 8453,
    wstETHAddress: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
    wethAddress: '0x4200000000000000000000000000000000000006',
  },
  '10': {
    name: 'OP',
    rpc: process.env.OP_RPC,
    chainId: 10,
    wstETHAddress: '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb',
    wethAddress: '0x4200000000000000000000000000000000000006',
    usdtAddress: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    daiAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  },
  '59144': {
    name: 'LINEA',
    rpc: process.env.LINEA_RPC,
    chainId: 59144,
    wstETHAddress: '0xB5beDd42000b71FddE22D3eE8a79Bd49A568fC8F',
    wethAddress: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
  },
  '56': {
    name: 'BINANCE SMART CHAIN',
    rpc: process.env.BSC_RPC,
    wethAddress: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', //!this is ether and not wrapped eth
  },
  '137': {
    name: 'POLYGON',
    rpc: process.env.POLYGON_RPC,
    wethAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  },
  '250': {
    name: 'FANTOM',
    rpc: process.env.FANTOM_RPC,
    wethAddress: '0x1B6382DBDEa11d97f24495C9A90b7c88469134a4', //!axelar usdc address
  },
  '43114': {
    name: 'AVALANCHE',
    rpc: process.env.AVALANCHE_RPC,
    wethAddress: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', //!usdt address
  },
  '534352': {
    name: 'SCROLL',
    rpc: process.env.SCROLL_RPC,
    wethAddress: '0x5300000000000000000000000000000000000004',
  },
  '81457': {
    name: 'BLAST',
    rpc: process.env.BLAST_RPC,
    wethAddress: '0x4300000000000000000000000000000000000004',
  },
  '1088': {
    name: 'METIS',
    rpc: process.env.METIS_RPC,
    wethAddress: '0x420000000000000000000000000000000000000a',
  },
};
