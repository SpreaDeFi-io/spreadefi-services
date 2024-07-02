import { CoderFunctionParamTypes, CoderFunctionParams } from 'src/common/types';
import { AbiCoder, Interface } from 'ethers';

export const encodeExternalCallData = (
  paramTypes: CoderFunctionParamTypes,
  params: CoderFunctionParams,
) => {
  return AbiCoder.defaultAbiCoder().encode(paramTypes, params);
};

export const encodeFunctionData = (
  abi: any[],
  functionName: string,
  params: CoderFunctionParams,
) => {
  const contractInterface = new Interface(abi);

  return params.length > 0
    ? contractInterface.encodeFunctionData(functionName, params)
    : contractInterface.encodeFunctionData(functionName);
};
