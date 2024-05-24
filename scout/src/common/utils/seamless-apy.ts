import { ethers } from 'ethers';
import { RPC_URLS } from '../constants';
import { AAVE_ABI } from '../constants/aave';
import { SEAMLESS_POOL_ADDRESSES } from '../constants/seamless';

async function getSeamlessApy(assetAddress: string, chainId: string) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
    const contractAddress = SEAMLESS_POOL_ADDRESSES[chainId];
    const contract = new ethers.Contract(contractAddress, AAVE_ABI, provider);
    const reserveData = await contract.getReserveData(assetAddress);
    const liquidityRateRay: bigint = reserveData[2];
    const apy = Number(liquidityRateRay) / 1e25;
    return apy;
  } catch (error) {
    console.error('Error fetching APY:', error);
    return null;
  }
}

export default getSeamlessApy;
