import { Injectable } from '@nestjs/common';
import { AAVE_POOL_ABI, ERC20_ABI } from 'src/common/constants';
import { AaveConfig } from 'src/common/constants/config/aave';
import { encodeFunctionData } from 'src/common/ethers';
import { aaveSupplyHandler } from 'src/common/hooks/aave';
import { Action, HookArgs, StrategyArgs } from 'src/common/types';
import { PrepareTransactionDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { SquidService } from 'src/libs/squid/squid.service';

@Injectable()
export class AaveService {
  constructor(private readonly squidService: SquidService) {}

  async prepareAaveTransaction({
    action,
    txData,
  }: Omit<PrepareTransactionDto, 'strategyName'>) {
    switch (action) {
      case Action.SUPPLY:
        await this.supply(txData);
        break;
      case Action.BORROW:
        'do something';
        break;
      case Action.REPAY:
        'do something';
        break;
      case Action.WITHDRAW:
        'do something';
        break;
    }
  }

  async supply(txData: StrategyArgs) {
    const transactions = [];

    if (txData.fromChain === txData.toChain) {
      //** Approve the tokens first
      const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
        AaveConfig[txData.fromChain].poolAddress,
        txData.fromAmount,
      ]);

      //** call the supply method
      const tx2 = encodeFunctionData(AAVE_POOL_ABI, 'supply', [
        txData.fromToken,
        txData.fromAmount,
        txData.fromAddress,
        0,
      ]);

      transactions.push(
        {
          to: txData.fromToken,
          type: 'Approve',
          tx: tx1,
        },
        {
          to: AaveConfig[txData.fromChain].poolAddress,
          type: 'Supply',
          tx: tx2,
        },
      );

      return transactions;
    } else {
      //* get the quote from squid
      //! How should we manage slippage goes here, I think it can be managed by actually overwriting the payload in aave supply handler
      //! we need to add payload in this case here
      //! add checks as well that this token should be available to deposit first before making the transaction
      const hookArgs: HookArgs = {
        fundToken: txData.fromToken,
        fundAmount: txData.fromAmount,
        contracts: [
          {
            target: txData.toToken,
            params: [AaveConfig[txData.toChain].poolAddress, txData.fromAmount], //!fromAmount here is wrong, it'll be toAmount, but we don't have toAmount. So, just use payload
          },
          {
            target: AaveConfig[txData.toChain].poolAddress,
            params: [txData.toToken, txData.fromAmount, txData.fromAddress, 0], //!fromAmount here is wrong as well
          },
        ],
      };
      const hook = aaveSupplyHandler(hookArgs);

      const tx1 = await this.squidService.createQuote({
        ...txData,
        postHook: hook,
      });

      transactions.push({
        to: '',
        type: 'Squid',
        tx: tx1,
      });

      return transactions;
    }
  }

  async borrow() {}

  async withdraw() {}
}
