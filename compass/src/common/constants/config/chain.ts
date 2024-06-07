import 'dotenv/config';

export const chains = {
  '42161': {
    name: 'ARB',
    rpc: process.env.ARB_RPC,
    chainId: 42161,
    wstETHAddress: '0x5979D7b546E38E414F7E9822514be443A4800529',
    wethAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    loopingStrategy: '0x',
  },
  '8453': {
    name: 'BASE',
    rpc: process.env.BASE_RPC,
    chainId: 8453,
    wstETHAddress: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
    wethAddress: '0x4200000000000000000000000000000000000006',
    loopingStrategy: '0x',
  },
  '10': {
    name: 'OP',
    rpc: process.env.OP_RPC,
    chainId: 10,
    wstETHAddress: '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb',
    wethAddress: '0x4200000000000000000000000000000000000006',
    loopingStrategy: '0x',
  },
  '59144': {
    name: 'LINEA',
    rpc: process.env.LINEA_RPC,
    chainId: 59144,
  },
};
