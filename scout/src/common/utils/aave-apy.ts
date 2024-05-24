import { ethers } from 'ethers';
import { RPC_URLS } from '../constants';
import { AAVE_ABI, AAVE_POOL_ADDRESSES } from '../constants/aave';

async function getAaveApy(assetAddress: string, chainId: string) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
    const aaveAddress = AAVE_POOL_ADDRESSES[chainId];
    const aaveContract = new ethers.Contract(aaveAddress, AAVE_ABI, provider);
    const reserveData = await aaveContract.getReserveData(assetAddress);
    const liquidityRateRay: bigint = reserveData[2];
    const apy = Number(liquidityRateRay) / 1e25;
    return apy;
  } catch (error) {
    console.error('Error fetching APY:', error);
    return null;
  }
}

export default getAaveApy;
