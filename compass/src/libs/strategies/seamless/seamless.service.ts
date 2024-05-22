import { Action, ExecutableTransaction } from 'src/common/types';
import { BadRequestException } from '@nestjs/common';
import { encodeFunctionData } from 'src/common/ethers';
import { SquidService } from 'src/libs/squid/squid.service';
import { ERC20_ABI, SEAMLESS_POOL_ABI } from 'src/common/constants/abi';
import { seamlessConfig } from 'src/common/constants/config/seamless';
import {
  seamlessRepayHandler,
  seamlessSupplyHandler,
} from 'src/common/hooks/seamless';
import {
  PrepareTransactionDto,
  TransactionDetailsDto,
} from 'src/core/resources/quote/dto/prepare-transaction.dto';

export class SeamlessService {
  constructor(private readonly squidService: SquidService) {}

  async prepareSeamlessTransaction({
    action,
    txDetails,
  }: Omit<PrepareTransactionDto, 'strategyName'>) {
    //!handle seamless functions differently as seamless is only available on base, so sometimes the dest chain and source chain should be base only

    let transactions: Array<ExecutableTransaction> = [];
    switch (action) {
      case Action.SUPPLY:
        transactions = await this.supply(txDetails);
        return transactions;
      case Action.BORROW:
        transactions = await this.borrow(txDetails);
        return transactions;
      case Action.REPAY:
        transactions = await this.repay(txDetails);
        return transactions;
        break;
      case Action.WITHDRAW:
        transactions = await this.withdraw(txDetails);
        return transactions;
      default:
        throw new BadRequestException('Undefined action');
    }
  }

  async supply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    //* seamless is only present on base
    if (
      txDetails.fromChain === txDetails.toChain &&
      txDetails.fromChain === '8453'
    ) {
      //** Approve the tokens first
      const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
        seamlessConfig[txDetails.fromChain].poolAddress,
        txDetails.fromAmount,
      ]);

      //** call the supply method
      const tx2 = encodeFunctionData(SEAMLESS_POOL_ABI, 'supply', [
        txDetails.fromToken,
        txDetails.fromAmount,
        txDetails.fromAddress,
        0,
      ]);

      transactions.push(
        {
          to: txDetails.fromToken,
          type: Action.APPROVE,
          tx: tx1,
        },
        {
          to: seamlessConfig[txDetails.fromChain].poolAddress,
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

      //* prepare the post hook
      const hook = seamlessSupplyHandler(txDetails);

      //* prepare squid Transaction data
      const tx1 = await this.squidService.createQuote({
        ...txDetails,
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

  async borrow(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    //* call borrow function
    const tx1 = encodeFunctionData(SEAMLESS_POOL_ABI, 'borrow', [
      txDetails.fromToken,
      txDetails.fromAmount,
      2,
      0,
      txDetails.fromAddress,
    ]);

    transactions.push({
      to: seamlessConfig[txDetails.fromChain].poolAddress,
      type: Action.BORROW,
      tx: tx1,
    });

    if (txDetails.fromChain !== txDetails.toChain) {
      const tx2 = await this.squidService.createQuote(txDetails);

      transactions.push({
        to: '',
        type: Action.SQUID,
        tx: tx2,
      });
    }

    return transactions;
  }

  async repay(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    if (txDetails.fromChain !== txDetails.toChain) {
      const hook = seamlessRepayHandler(txDetails);

      const tx1 = await this.squidService.createQuote({
        ...txDetails,
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
        seamlessConfig[txDetails.fromChain].poolAddress,
        txDetails.fromAmount,
      ]);

      transactions.push({
        to: txDetails.fromToken,
        type: Action.APPROVE,
        tx: tx1,
      });

      const tx2 = encodeFunctionData(SEAMLESS_POOL_ABI, 'repay', [
        txDetails.fromToken,
        txDetails.fromAmount,
        1,
        0,
        txDetails.fromAddress,
      ]);

      transactions.push({
        to: seamlessConfig[txDetails.fromChain].poolAddress,
        type: Action.REPAY,
        tx: tx2,
      });

      return transactions;
    }
  }

  async withdraw(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    //** Take approval of the aToken
    const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
      seamlessConfig[txDetails.fromChain].poolAddress,
      txDetails.fromAmount,
    ]);

    transactions.push({
      to: txDetails.fundToken,
      type: Action.APPROVE,
      tx: tx1,
    });

    //** Call the Withdraw method
    const tx2 = encodeFunctionData(SEAMLESS_POOL_ABI, 'withdraw', [
      txDetails.fromToken,
      txDetails.fromAmount,
      txDetails.fromAddress,
    ]);

    transactions.push({
      to: seamlessConfig[txDetails.fromChain].poolAddress,
      type: Action.WITHDRAW,
      tx: tx2,
    });

    if (txDetails.fromChain !== txDetails.toChain) {
      const tx3 = await this.squidService.createQuote(txDetails);

      transactions.push({
        to: '',
        type: Action.SQUID,
        tx: tx3,
      });
    }

    return transactions;
  }
}
