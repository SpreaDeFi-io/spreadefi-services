import { BadRequestException } from '@nestjs/common';
import { PrepareTransactionDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { Action, HookArgs, StrategyArgs } from 'src/common/types';
import { encodeFunctionData } from 'src/common/ethers';
import { ERC20_ABI, SEAMLESS_POOL_ABI } from 'src/common/constants';
import { seamlessConfig } from 'src/common/constants/config/seamless';
import { SquidService } from 'src/libs/squid/squid.service';
import {
  seamlessRepayHandler,
  seamlessSupplyHandler,
} from 'src/common/hooks/seamless';

export class SeamlessService {
  constructor(private readonly squidService: SquidService) {}

  async prepareSeamlessTransaction({
    action,
    txData,
  }: Omit<PrepareTransactionDto, 'strategyName'>) {
    //!handle seamless functions differently as seamless is only available on base, so sometimes the dest chain and source chain should be base only

    let transactions: any[];
    switch (action) {
      case Action.SUPPLY:
        transactions = await this.supply(txData);
        return transactions;
      case Action.BORROW:
        transactions = await this.borrow(txData);
        return transactions;
      case Action.REPAY:
        transactions = await this.repay(txData);
        return transactions;
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

    //* seamless is only present on base
    if (txData.fromChain === txData.toChain && txData.fromChain === '8453') {
      //** Approve the tokens first
      const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
        seamlessConfig[txData.fromChain].poolAddress,
        txData.fromAmount,
      ]);

      //** call the supply method
      const tx2 = encodeFunctionData(SEAMLESS_POOL_ABI, 'supply', [
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
          to: seamlessConfig[txData.fromChain].poolAddress,
          type: Action.SUPPLY,
          tx: tx2,
        },
      );

      return transactions;
    } else {
      //* get the quote from squid
      //! How should we manage slippage goes here, I think it can be managed by actually overwriting the payload in seamless supply handler
      //! we need to add payload in this case here
      //! add checks as well that this token should be available to deposit first before making the transaction
      const hookArgs: HookArgs = {
        fundToken: txData.fromToken,
        fundAmount: txData.fromAmount,
        contracts: [
          {
            target: txData.toToken,
            params: [
              seamlessConfig[txData.toChain].poolAddress,
              txData.fromAmount,
            ], //!fromAmount here is wrong, it'll be toAmount, but we don't have toAmount. So, just use payload
          },
          {
            target: seamlessConfig[txData.toChain].poolAddress,
            params: [txData.toToken, txData.fromAmount, txData.fromAddress, 0], //!fromAmount here is wrong as well
          },
        ],
      };
      //* prepare the post hook
      const hook = seamlessSupplyHandler(hookArgs);

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
    const tx1 = encodeFunctionData(SEAMLESS_POOL_ABI, 'borrow', [
      txData.fromToken,
      txData.fromAmount,
      1,
      0,
      txData.fromAddress,
    ]);

    transactions.push({
      to: seamlessConfig[txData.fromChain].poolAddress,
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
            params: [
              seamlessConfig[txData.toChain].poolAddress,
              txData.fromAmount,
            ], //!fromAmount here is wrong, it'll be toAmount, but we don't have toAmount. So, just use payload
          },
          {
            target: seamlessConfig[txData.toChain].poolAddress,
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

      const hook = seamlessRepayHandler(hookArgs);

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
        seamlessConfig[txData.fromChain].poolAddress,
        txData.fromAmount,
      ]);

      transactions.push({
        to: txData.fromToken,
        type: Action.APPROVE,
        tx: tx1,
      });

      const tx2 = encodeFunctionData(SEAMLESS_POOL_ABI, 'repay', [
        txData.fromToken,
        txData.fromAmount,
        1,
        0,
        txData.fromAddress,
      ]);

      transactions.push({
        to: seamlessConfig[txData.fromChain].poolAddress,
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
      seamlessConfig[txData.fromChain].poolAddress,
      txData.fromAmount,
    ]);

    transactions.push({
      to: txData.fundToken,
      type: Action.APPROVE,
      tx: tx1,
    });

    //** Call the Withdraw method
    const tx2 = encodeFunctionData(SEAMLESS_POOL_ABI, 'withdraw', [
      txData.fromToken,
      txData.fromAmount,
      txData.fromAddress,
    ]);

    transactions.push({
      to: seamlessConfig[txData.fromChain].poolAddress,
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
