import { CoderFunctionParamTypes } from 'src/common/types';
import { BytesLike, AbiCoder } from 'ethers';

export const decodeExternalCallData = (
  paramTypes: CoderFunctionParamTypes,
  data: BytesLike,
) => {
  return AbiCoder.defaultAbiCoder().decode(paramTypes, data);
};
