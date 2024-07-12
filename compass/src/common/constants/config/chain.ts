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
  },
};
