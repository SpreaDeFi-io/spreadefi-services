import { BadRequestException, Injectable } from '@nestjs/common';
import { ETHEREUM_ADDRESS_SQUID } from 'src/common/constants';
import { ERC20_ABI, ZEROLEND_POOL_ABI } from 'src/common/constants/abi';
import { zerolendConfig } from 'src/common/constants/config/zerolend';
import { encodeFunctionData } from 'src/common/ethers';
import {
  zerolendRepayHandler,
  zerolendSupplyHandler,
} from 'src/common/hooks/zerolend';
import { Action, ExecutableTransaction } from 'src/common/types';
import {
  PrepareTransactionDto,
  TransactionDetailsDto,
} from 'src/core/resources/quote/dto/prepare-transaction.dto';
// import { isProtocolAvailable } from 'src/libs/protocol/protocol-checker';
import { SquidService } from 'src/libs/squid/squid.service';

@Injectable()
export class ZerolendService {
  constructor(private readonly squidService: SquidService) {}

  async prepareZerolendTransaction({
    action,
    txDetails,
  }: Omit<PrepareTransactionDto, 'strategyName'>) {
    let transactions: Array<ExecutableTransaction> = [];

    //* check if protocol exists on to chain
    // const isAvailableOnToChain = isProtocolAvailable(
    //   'Zerolend',
    //   txDetails.toChain,
    // );

    // if (!isAvailableOnToChain)
    //   throw new BadRequestException('Protocol does not exist on To chain');

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

      case Action.WITHDRAW:
        transactions = await this.withdraw(txDetails);
        return transactions;

      default:
        throw new BadRequestException('Undefined action');
    }
  }

  async supply(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    //* Integrate zerolend for linea chain only
    //* if user wants to supply same token he has on the same chain then we don't need to use squid
    if (
      txDetails.fromChain === txDetails.toChain &&
      txDetails.fromChain === '59144' &&
      txDetails.fromToken === txDetails.toToken
    ) {
      //** Approve the tokens first
      //** If token is ethereum we don't need approval

      if (txDetails.fromToken !== ETHEREUM_ADDRESS_SQUID) {
        const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
          zerolendConfig[txDetails.fromChain].poolAddress,
          txDetails.fromAmount,
        ]);

        transactions.push({
          chain: txDetails.fromChain,
          to: txDetails.fromToken,
          type: Action.APPROVE,
          tx: tx1,
        });
      }

      //** call the supply method
      const tx2 = encodeFunctionData(ZEROLEND_POOL_ABI, 'supply', [
        txDetails.fromToken, //! fromToken will be different if eth is supplied
        txDetails.fromAmount,
        txDetails.fromAddress,
        0,
      ]);

      transactions.push({
        chain: txDetails.fromChain,
        to: zerolendConfig[txDetails.fromChain].poolAddress,
        type: Action.SUPPLY,
        tx: tx2,
      });

      return transactions;
    } else {
      //* get the quote from squid
      //* prepare the post hook
      const hook = zerolendSupplyHandler(txDetails);

      //* prepare squid Transaction data
      const tx1 = await this.squidService.createQuote({
        ...txDetails,
        postHook: hook,
      });

      transactions.push({
        chain: txDetails.fromChain,
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
    const tx1 = encodeFunctionData(ZEROLEND_POOL_ABI, 'borrow', [
      txDetails.fromToken, //! fromToken will be different if we are borrowing eth
      txDetails.fromAmount,
      2,
      0,
      txDetails.fromAddress,
    ]);

    transactions.push({
      chain: txDetails.fromChain,
      to: zerolendConfig[txDetails.fromChain].poolAddress,
      type: Action.BORROW,
      tx: tx1,
    });

    //* if user wants different token, or token on different chain or different token on different chain
    //* then call squid
    if (
      txDetails.fromChain !== txDetails.toChain ||
      txDetails.fromToken !== txDetails.toToken
    ) {
      const tx2 = await this.squidService.createQuote(txDetails);

      transactions.push({
        chain: txDetails.fromChain,
        to: '',
        type: Action.SQUID,
        tx: tx2,
      });
    }

    return transactions;
  }

  async repay(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    //* if user wants to repay on different chain or wants to pay from different token or wants to pay on different chain
    //* from different token then use squid
    if (
      txDetails.fromChain !== txDetails.toChain ||
      txDetails.fromToken !== txDetails.toToken
    ) {
      const hook = zerolendRepayHandler(txDetails);

      const tx1 = await this.squidService.createQuote({
        ...txDetails,
        postHook: hook,
      });

      transactions.push({
        chain: txDetails.fromChain,
        to: '',
        type: Action.SQUID,
        tx: tx1,
      });

      return transactions;
    } else {
      if (txDetails.toToken !== ETHEREUM_ADDRESS_SQUID) {
        const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
          zerolendConfig[txDetails.fromChain].poolAddress,
          txDetails.fromAmount,
        ]);

        transactions.push({
          chain: txDetails.fromChain,
          to: txDetails.fromToken,
          type: Action.APPROVE,
          tx: tx1,
        });
      }

      const tx2 = encodeFunctionData(ZEROLEND_POOL_ABI, 'repay', [
        txDetails.fromToken, //! fromToken will differ here if token is ETH
        txDetails.fromAmount,
        1,
        0,
        txDetails.fromAddress,
      ]);

      transactions.push({
        chain: txDetails.fromChain,
        to: zerolendConfig[txDetails.fromChain].poolAddress,
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
      zerolendConfig[txDetails.fromChain].poolAddress,
      txDetails.fromAmount,
    ]);

    transactions.push({
      chain: txDetails.fromChain,
      to: txDetails.fundToken,
      type: Action.APPROVE,
      tx: tx1,
    });

    //** Call the Withdraw method
    const tx2 = encodeFunctionData(ZEROLEND_POOL_ABI, 'withdraw', [
      txDetails.fromToken, //!fromToken will differ here in case of ETH
      txDetails.fromAmount,
      txDetails.fromAddress,
    ]);

    transactions.push({
      chain: txDetails.fromChain,
      to: zerolendConfig[txDetails.fromChain].poolAddress,
      type: Action.WITHDRAW,
      tx: tx2,
    });

    if (
      txDetails.fromChain !== txDetails.toChain ||
      txDetails.fromToken !== txDetails.toToken
    ) {
      const tx3 = await this.squidService.createQuote(txDetails);

      transactions.push({
        chain: txDetails.fromChain,
        to: '',
        type: Action.SQUID,
        tx: tx3,
      });
    }

    return transactions;
  }
}
