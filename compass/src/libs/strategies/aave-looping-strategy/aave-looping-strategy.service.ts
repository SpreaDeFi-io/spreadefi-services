import { ethers } from 'ethers';
import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { encodeFunctionData, ethersContract } from 'src/common/ethers';
import { aaveConfig } from 'src/common/constants/config/aave';
import {
  AAVE_CREDIT_DELEGATION_ABI,
  AAVE_POOL_ABI,
  ERC20_ABI,
} from 'src/common/constants/abi';
import { Action, ExecutableTransaction } from 'src/common/types';
import { chains } from 'src/common/constants/config/chain';
import { loopStrategyHandler } from 'src/common/hooks/looping-strategy';
import { SquidService } from 'src/libs/squid/squid.service';
// import { isProtocolAvailable } from 'src/libs/protocol/protocol-checker';
import { loopingConfig } from 'src/common/constants/config/looping';

@Injectable()
export class AaveLoopingStrategyService {
  constructor(private readonly squidService: SquidService) {}

  /**
   * * Creates the looping strategy for aave
   * * Takes any token as input and converts it to toToken for starter
   * * sets the e-mode as enabled for user on destination chain and approves the delegation
   * * then calls squid's SDK to allow bridging and calling the looping strategy function
   */
  async createLoopingStrategy(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    // const isAvailableOnToChain = isProtocolAvailable('Aave', txDetails.toChain);

    // if (!isAvailableOnToChain)
    //   throw new BadRequestException('Protocol does not exist on to chain');

    const isLeverageAllowed =
      txDetails.leverage <=
      loopingConfig['Aave'][txDetails.toChain][txDetails.toToken].leverage;

    if (!isLeverageAllowed)
      throw new BadRequestException('Leverage is more than specified');

    //! add a check here to only allow supported tokens maybe

    const rpcUrl = chains[txDetails.toChain].rpc;

    const aavePoolContract = ethersContract(
      aaveConfig[txDetails.toChain].poolAddress,
      AAVE_POOL_ABI,
      rpcUrl,
    );

    //* check if e mode is enabled
    const isEModeEnabled = await aavePoolContract.getUserEMode(
      txDetails.fromAddress,
    );

    //* if e mode is not enabled then enable it for the user
    if (Number(isEModeEnabled.toString()) === 0) {
      const eModeTx = encodeFunctionData(AAVE_POOL_ABI, 'setUserEMode', [
        txDetails.toChain === '8453' ? 1 : 2,
      ]); //! set e-mode to 1 if blockchain is base

      transactions.push({
        chain: txDetails.toChain,
        to: aaveConfig[txDetails.toChain].poolAddress,
        type: Action.E_MODE,
        tx: eModeTx,
      });
    }

    const aaveDelegationContract = ethersContract(
      aaveConfig[txDetails.toChain].wethDebtToken,
      AAVE_CREDIT_DELEGATION_ABI,
      rpcUrl,
    );

    //* check if user has already approved delegation
    const borrowAllowance = await aaveDelegationContract.borrowAllowance(
      txDetails.fromAddress,
      loopingConfig['Aave'][txDetails.toChain][txDetails.toToken]
        .loopingContract,
    );

    //* if borrow allowance is less than 2000 ETH in wei, then ask for delegation approval
    if (BigInt(borrowAllowance.toString()) < BigInt('2000000000000000000000')) {
      const approveDelegationTx = encodeFunctionData(
        AAVE_CREDIT_DELEGATION_ABI,
        'approveDelegation',
        [
          loopingConfig['Aave'][txDetails.toChain][txDetails.toToken]
            .loopingContract,
          ethers.MaxUint256,
        ],
      );

      transactions.push({
        chain: txDetails.toChain,
        to: aaveConfig[txDetails.toChain].wethDebtToken,
        type: Action.APPROVE_DELEGATION,
        tx: approveDelegationTx,
      });
    }

    //* if user wants to make the tx on same chain and the token is wstETH as well, then we don't need squid
    if (
      txDetails.fromChain === txDetails.toChain &&
      ethers.getAddress(txDetails.fromToken) ===
        ethers.getAddress(txDetails.toToken)
    ) {
      //* approve the wstETH token
      const approveTx = encodeFunctionData(ERC20_ABI, 'approve', [
        loopingConfig['Aave'][txDetails.toChain][txDetails.toToken]
          .loopingContract,
        txDetails.fromAmount,
      ]);

      transactions.push({
        chain: txDetails.fromChain,
        to: txDetails.toToken,
        type: Action.APPROVE,
        tx: approveTx,
      });

      //* call the looping strategy function here
      const loopStrategyTx = encodeFunctionData(
        loopingConfig['Aave'][txDetails.toChain][txDetails.toToken].abi,
        'loopStrategy',
        [
          txDetails.toToken,
          chains[txDetails.fromChain].wethAddress,
          txDetails.fromAmount,
          txDetails.leverage,
          txDetails.fromAddress,
          loopingConfig['Aave'][txDetails.toChain][txDetails.toToken]
            .borrowPercentage,
          100,
          10,
        ],
      );

      transactions.push({
        chain: txDetails.toChain,
        to: loopingConfig['Aave'][txDetails.toChain][txDetails.toToken]
          .loopingContract,
        type: Action.LOOP_STRATEGY,
        tx: loopStrategyTx,
      });
    } else {
      const hook = loopStrategyHandler(txDetails, 'Aave');

      const squidTx = await this.squidService.createQuote({
        ...txDetails,
        toToken:
          ethers.getAddress(txDetails.toToken) ===
          ethers.getAddress(chains[txDetails.toChain].wstETHAddress)
            ? chains[txDetails.toChain].wethAddress
            : txDetails.toToken,
        postHook: hook,
      });

      transactions.push({
        chain: txDetails.fromChain,
        to: '',
        type: Action.SQUID,
        tx: squidTx,
      });
    }

    return transactions;
  }
}
