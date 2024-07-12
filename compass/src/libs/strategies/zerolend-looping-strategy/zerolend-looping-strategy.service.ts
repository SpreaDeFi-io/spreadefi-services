import { ethers } from 'ethers';
import { Injectable } from '@nestjs/common';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { encodeFunctionData, ethersContract } from 'src/common/ethers';
import {
  ERC20_ABI,
  ZEROLEND_CREDIT_DELEGATION_ABI,
  ZEROLEND_POOL_ABI,
} from 'src/common/constants/abi';
import { Action, ExecutableTransaction } from 'src/common/types';
import { chains } from 'src/common/constants/config/chain';
import { loopStrategyHandler } from 'src/common/hooks/looping-strategy';
import { SquidService } from 'src/libs/squid/squid.service';
import { zerolendConfig } from 'src/common/constants/config/zerolend';
import { loopingConfig } from 'src/common/constants/config/looping';

@Injectable()
export class ZerolendLoopingStrategyService {
  constructor(private readonly squidService: SquidService) {}

  /**
   * * Creates the looping strategy for zerolend
   * * Takes any token as input and converts it to wstETH for starter
   * * sets the e-mode as enabled for user on destination chain and approves the delegation
   * * then calls squid's SDK to allow bridging and calling the looping strategy function
   */
  async createLoopingStrategy(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const rpcUrl = chains[txDetails.toChain].rpc;

    const zerolendPoolContract = ethersContract(
      zerolendConfig[txDetails.toChain].poolAddress,
      ZEROLEND_POOL_ABI,
      rpcUrl,
    );

    //* check if e mode is enabled
    const isEModeEnabled = await zerolendPoolContract.getUserEMode(
      txDetails.fromAddress,
    );

    //* if e mode is not enabled then enable it for the user
    if (Number(isEModeEnabled.toString()) === 0) {
      const eModeTx = encodeFunctionData(ZEROLEND_POOL_ABI, 'setUserEMode', [
        2,
      ]); //! set e-mode to 2 since blockchain for zerolend is linea and not base

      transactions.push({
        chain: txDetails.toChain,
        to: zerolendConfig[txDetails.toChain].poolAddress,
        type: Action.E_MODE,
        tx: eModeTx,
      });
    }

    const zerolendDelegationContract = ethersContract(
      zerolendConfig[txDetails.toChain].wethDebtToken,
      ZEROLEND_CREDIT_DELEGATION_ABI,
      rpcUrl,
    );

    //* check if user has already approved delegation
    const borrowAllowance = await zerolendDelegationContract.borrowAllowance(
      txDetails.fromAddress,
      chains[txDetails.toChain].loopingStrategy,
    );

    //* if borrow allowance is less than 2000 ETH in wei, then ask for delegation approval
    if (BigInt(borrowAllowance.toString()) < BigInt('2000000000000000000000')) {
      const approveDelegationTx =
        await zerolendDelegationContract.approveDelegation(
          chains[txDetails.toChain].loopingStrategy,
          ethers.MaxUint256 - BigInt(borrowAllowance.toString()),
        );

      transactions.push({
        chain: txDetails.toChain,
        to: zerolendConfig[txDetails.toChain].wethDebtToken,
        type: Action.APPROVE_DELEGATION,
        tx: approveDelegationTx,
      });
    }

    //* if user wants to make the tx on same chain and the token is wstETH as well, then we don't need squid
    if (
      txDetails.fromChain === txDetails.toChain &&
      txDetails.fromToken === txDetails.toToken
    ) {
      //* approve the wstETH token
      const approveTx = encodeFunctionData(ERC20_ABI, 'approve', [
        chains[txDetails.toChain].loopingStrategy,
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
        loopingConfig['Zerolend'][txDetails.toChain][txDetails.toToken].abi,
        'loopStrategy',
        [
          txDetails.toToken,
          chains[txDetails.fromChain].wethAddress,
          txDetails.fromAmount,
          txDetails.leverage,
          txDetails.fromAddress,
          loopingConfig['Zerolend'][txDetails.toChain][txDetails.toToken]
            .borrowPercentage,
          100,
          10,
        ],
      );

      transactions.push({
        chain: txDetails.toChain,
        to: chains[txDetails.toChain].loopingStrategy,
        type: Action.LOOP_STRATEGY,
        tx: loopStrategyTx,
      });
    } else {
      const hook = loopStrategyHandler(txDetails, 'Seamless');

      const squidTx = await this.squidService.createQuote({
        ...txDetails,
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
