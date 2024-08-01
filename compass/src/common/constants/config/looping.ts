import { LOOPING_STRATEGY_ABI } from '../abi/loopingStrategy';
import { LOOPING_STRATEGY_V2_ABI } from '../abi/loopingStrategyV2';
import { LOOPING_STRATEGY_V3_ABI } from '../abi/loopingStrategyV3';

export const loopingConfig = {
  Aave: {
    '42161': {
      '0x5979D7b546E38E414F7E9822514be443A4800529': {
        //wstETH
        leverage: 12.5,
        loopingContract: '0xacfc39d994289271ee1309e49a7c252a8c373451',
        abi: LOOPING_STRATEGY_V3_ABI,
        borrowPercentage: 108,
      },
      //! add support for rETH later
    },
    '10': {
      '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb': {
        //wstETH
        leverage: 12.5,
        loopingContract: '0x48eCe3F01Eb811B174e04Ca88578A826c1204665',
        abi: LOOPING_STRATEGY_V3_ABI,
        borrowPercentage: 108,
      },
      '0x9Bcef72be871e61ED4fBbc7630889beE758eb81D': {
        //rETH
        leverage: 6,
        loopingContract: '0x9034Dd164780E43b28D2b048A9CA792b222E657a',
        abi: LOOPING_STRATEGY_ABI,
        borrowPercentage: 103,
      },
    },
    '8453': {
      '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452': {
        //wstETH
        leverage: 8.8,
        loopingContract: '0x7620c00726B24EaCf379d85d35935eE0f01E0847',
        abi: LOOPING_STRATEGY_V3_ABI,
        borrowPercentage: 105,
      },
      '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22': {
        //cbETH
        leverage: 8,
        loopingContract: '0xaf5eDa95b87fCf9767cED0d9c01b69e0A976C725',
        abi: LOOPING_STRATEGY_ABI,
        borrowPercentage: 96,
      },
    },
  },
  Seamless: {
    '8453': {
      '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452': {
        //wstETH
        leverage: 8.8,
        loopingContract: '0xd27ca92959B9cd8bBd493b2713AFFb05EB0a4252',
        abi: LOOPING_STRATEGY_V3_ABI,
        borrowPercentage: 105,
      },
      '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22': {
        //cbETH
        leverage: 8,
        loopingContract: '0x0a9723b00f835145751b9183775af2a52e406ebe',
        abi: LOOPING_STRATEGY_ABI,
        borrowPercentage: 96,
      },
    },
  },
  Zerolend: {
    '59144': {
      '0xB5beDd42000b71FddE22D3eE8a79Bd49A568fC8F': {
        //wstETH
        leverage: 3,
        loopingContract: '0x15ebb010e7355690de6a5227733879505c381e03',
        abi: LOOPING_STRATEGY_V2_ABI,
        borrowPercentage: 81,
      },
    },
  },
};
