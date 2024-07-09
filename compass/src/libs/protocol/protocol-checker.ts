import { protocolOnChains } from 'src/common/constants';

export const isProtocolAvailable = (protocolName: string, chainId: string) => {
  return protocolOnChains[protocolName]?.chains.includes(chainId) || false;
};
