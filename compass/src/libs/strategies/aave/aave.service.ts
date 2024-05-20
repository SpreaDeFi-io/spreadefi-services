import { BadRequestException, Injectable } from '@nestjs/common';
import { encodeFunctionData } from 'src/common/ethers';
import { aaveRepayHandler, aaveSupplyHandler } from 'src/common/hooks/aave';
import { SquidService } from 'src/libs/squid/squid.service';
import { AaveConfig } from 'src/common/constants/config/aave';
import { AAVE_POOL_ABI, ERC20_ABI } from 'src/common/constants';
import { Action, HookArgs, StrategyArgs } from 'src/common/types';
import { PrepareTransactionDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';

@Injectable()
export class AaveService {
  constructor(private readonly squidService: SquidService) {}

  async prepareAaveTransaction({
    action,
    txData,
  }: Omit<PrepareTransactionDto, 'strategyName'>) {
    let transactions: any[];
    switch (action) {
      case Action.SUPPLY:
        transactions = await this.supply(txData);
        return transactions;
      case Action.BORROW:
        transactions = await this.borrow(txData);
        return transactions;
      case Action.REPAY:
        // transactions = await this.repay(txData);
        // return transactions;
        break;
      case Action.WITHDRAW:
        transactions = await this.withdraw(txData);
        return transactions;
      default:
        throw new BadRequestException('Undefined action');
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
          type: Action.APPROVE,
          tx: tx1,
        },
        {
          to: AaveConfig[txData.fromChain].poolAddress,
          type: Action.SUPPLY,
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
      //* prepare the post hook
      const hook = aaveSupplyHandler(hookArgs);

      //* prepare squid Transaction data
      const tx1 = await this.squidService.createQuote({
        ...txData,
        postHook: hook,
      });

      transactions.push({
        to: '',
        type: Action.SQUID,
        tx: tx1,
      });

      return transactions;
    }
  }

  async borrow(txData: StrategyArgs) {
    const transactions = [];

    //* call borrow function
    const tx1 = encodeFunctionData(AAVE_POOL_ABI, 'borrow', [
      txData.fromToken,
      txData.fromAmount,
      1,
      0,
      txData.fromAddress,
    ]);

    transactions.push({
      to: AaveConfig[txData.fromChain].poolAddress,
      type: Action.BORROW,
      tx: tx1,
    });

    if (txData.fromChain !== txData.toChain) {
      const tx2 = await this.squidService.createQuote(txData);

      transactions.push({
        to: '',
        type: Action.SQUID,
        tx: tx2,
      });
    }

    return transactions;
  }

  async repay(txData: StrategyArgs) {
    const transactions = [];

    if (txData.fromChain !== txData.toChain) {
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
            params: [
              txData.toToken,
              txData.fromAmount,
              1,
              0,
              txData.fromAddress,
            ], //!fromAmount here is wrong as well
          },
        ],
      };

      const hook = aaveRepayHandler(hookArgs);

      const tx1 = await this.squidService.createQuote({
        ...txData,
        postHook: hook,
      });

      transactions.push({
        to: '',
        type: Action.SQUID,
        tx: tx1,
      });

      return transactions;
    } else {
      const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
        AaveConfig[txData.fromChain].poolAddress,
        txData.fromAmount,
      ]);

      transactions.push({
        to: txData.fromToken,
        type: Action.APPROVE,
        tx: tx1,
      });

      const tx2 = encodeFunctionData(AAVE_POOL_ABI, 'repay', [
        txData.fromToken,
        txData.fromAmount,
        1,
        0,
        txData.fromAddress,
      ]);

      transactions.push({
        to: AaveConfig[txData.fromChain].poolAddress,
        type: Action.REPAY,
        tx: tx2,
      });

      return transactions;
    }
  }

  async withdraw(txData: StrategyArgs) {
    const transactions = [];

    //** Take approval of the aToken
    const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
      AaveConfig[txData.fromChain].poolAddress,
      txData.fromAmount,
    ]);

    transactions.push({
      to: txData.fundToken,
      type: Action.APPROVE,
      tx: tx1,
    });

    //** Call the Withdraw method
    const tx2 = encodeFunctionData(AAVE_POOL_ABI, 'withdraw', [
      txData.fromToken,
      txData.fromAmount,
      txData.fromAddress,
    ]);

    transactions.push({
      to: AaveConfig[txData.fromChain].poolAddress,
      type: Action.WITHDRAW,
      tx: tx2,
    });

    if (txData.fromChain !== txData.toChain) {
      const tx3 = await this.squidService.createQuote(txData);

      transactions.push({
        to: '',
        type: Action.SQUID,
        tx: tx3,
      });
    }

    return transactions;
  }
}
