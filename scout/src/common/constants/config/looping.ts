export const loopingConfig = {
  Aave: {
    '42161': {
      '0x5979D7b546E38E414F7E9822514be443A4800529': {
        //wstETH
        leverage: 12.5,
        loopingContract: '0x2Af8a29c47f62965798dA5003218b73eAFb95945',

        borrowPercentage: 108,
      },
      //! add support for rETH later
    },
    '10': {
      '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb': {
        //wstETH
        leverage: 12.5,
        loopingContract: '0xbeA37afDa1a7320E3646aA6402680952A9f6EF56',

        borrowPercentage: 108,
      },
      '0x9Bcef72be871e61ED4fBbc7630889beE758eb81D': {
        //rETH
        leverage: 8,
        loopingContract: '0x9034Dd164780E43b28D2b048A9CA792b222E657a',
        borrowPercentage: 103,
      },
    },
    '8453': {
      '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452': {
        //wstETH
        leverage: 8.8,
        loopingContract: '0xf1b5d1f90c4151d1ecd82401caf1fd68cbc4d5be',
        borrowPercentage: 105,
      },
      '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22': {
        //cbETH
        leverage: 8,
        loopingContract: '0xaf5eDa95b87fCf9767cED0d9c01b69e0A976C725',
        borrowPercentage: 96,
      },
    },
  },
  Seamless: {
    '8453': {
      '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452': {
        //wstETH
        leverage: 8.8,
        loopingContract: '0xaf5eda95b87fcf9767ced0d9c01b69e0a976c725',
        borrowPercentage: 105,
      },
      '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22': {
        //cbETH
        leverage: 8,
        loopingContract: '0x0a9723b00f835145751b9183775af2a52e406ebe',
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
        borrowPercentage: 81,
      },
    },
  },
};
