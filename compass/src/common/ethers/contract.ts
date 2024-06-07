import { ethers } from 'ethers';

export const ethersContract = (
  contractAddress: string,
  abi: Array<any>,
  rpcUrl: string,
) => {
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const contract = new ethers.Contract(contractAddress, abi, provider);

  return contract;
};
