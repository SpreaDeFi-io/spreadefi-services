import { ethers } from 'ethers';
import { RPC_URLS } from '../../constants';
import { AAVE_POOL_ABI } from '../../constants/abi';
import { aaveConfig } from '../../constants/config/aave';

async function getAaveApy(assetAddress: string, chainId: string) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
    const aaveAddress = aaveConfig[chainId].poolAddress;

    const aaveContract = new ethers.Contract(
      aaveAddress,
      AAVE_POOL_ABI,
      provider,
    );

    const reserveData = await aaveContract.getReserveData(assetAddress);
    const liquidityRateRay: bigint = reserveData[2];

    const apy = Number(liquidityRateRay) / 1e25;
    return apy;
  } catch (error) {
    console.error('Error fetching APY:', error);
    throw new Error(error);
  }
}

export default getAaveApy;
