import { ethers } from 'ethers';
import { AAVE_ABI, AAVE_POOL_ADDRESSES, RPC_URLS } from '../constants';

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
  }
}

export default getAaveApy;
