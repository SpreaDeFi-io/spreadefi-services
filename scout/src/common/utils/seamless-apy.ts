import { ethers } from 'ethers';
import { RPC_URLS } from '../constants';
import { seamlessConfig } from '../constants/config/seamless';
import { SEAMLESS_POOL_ABI } from '../constants/abi';

async function getSeamlessApy(assetAddress: string, chainId: string) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
    const contractAddress = seamlessConfig[chainId].poolAddress;
    const contract = new ethers.Contract(
      contractAddress,
      SEAMLESS_POOL_ABI,
      provider,
    );
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
