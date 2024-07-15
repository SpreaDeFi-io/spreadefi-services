import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { CHAINS, RPC_URLS } from 'src/common/constants';
import {
  AAVE_POOL_ABI,
  SEAMLESS_POOL_ABI,
  ZEROLEND_POOL_ABI,
} from 'src/common/constants/abi';
import { aaveConfig } from 'src/common/constants/config/aave';
import { seamlessConfig } from 'src/common/constants/config/seamless';
import { zerolendConfig } from 'src/common/constants/config/zerolend';
import { PortfolioLogger } from './portfolio.logger';
import { CovalentService } from 'src/libs/covalent/covalent.service';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly covalentService: CovalentService,
    private readonly portfolioLogger: PortfolioLogger,
  ) {}

  /**
   * Fetches the total balance present in the wallet, total collateral, and debt across all protocols for a user's wallet.
   * @param walletAddress - The wallet address of the user.
   * @returns An object containing totalCollateralBase, totalDebtBase, and totalBalanceUSD.
   */
  async getTotalBalance(walletAddress: string) {
    const [aaveBalances, zerolendBalances, seamlessBalances] =
      await Promise.all([
        this.getAaveTotalValue(walletAddress),
        this.getZerolendTotalValue(walletAddress),
        this.getSeamlessTotalValue(walletAddress),
      ]);

    const mergedBalance = this.mergeBalances([
      aaveBalances,
      zerolendBalances,
      seamlessBalances,
    ]);

    //add more params here based on frontend requirement
    const totalCollateralBase = this.calculateTotal(mergedBalance, 0);
    const totalDebtBase = this.calculateTotal(mergedBalance, 1);

    let totalBalanceUSD = 0;
    const chainBalance = {};

    await Promise.all(
      Object.values(CHAINS).map(async (chainId: any) => {
        const chainBalanceData =
          await this.covalentService.getWalletBalanceForChain(
            walletAddress,
            chainId,
          );

        const result = chainBalanceData.reduce((acc, item) => {
          acc[item.contract_address] = {
            balance: item.balance,
            price: item.pretty_quote,
          };
          return acc;
        }, {});

        chainBalance[chainId] = result;

        // Calculate total USD for the current chain
        const chainTotalBalanceUSD = chainBalanceData.reduce(
          (total, balance) => {
            return total + (balance.quote || 0);
          },
          0,
        );

        totalBalanceUSD += chainTotalBalanceUSD;
      }),
    );

    return {
      totalCollateralBase: totalCollateralBase,
      totalDebtBase: totalDebtBase,
      totalBalanceUSD: totalBalanceUSD,
      chainBalance: this.convertBalanceToStrings(chainBalance),
      aaveBalances: this.convertBalanceToStrings(aaveBalances),
      seamlessBalances: this.convertBalanceToStrings(seamlessBalances),
      zerolendBalances: this.convertBalanceToStrings(zerolendBalances),
    };
  }

  /**
   * Fetches the total value of Aave protocol assets for a specific user.
   * @param walletAddress - The wallet address of the user.
   * @returns An array containing account data from Aave.
   */
  async getAaveTotalValue(walletAddress: string) {
    try {
      const balanceDataPromises = Object.keys(aaveConfig).map(
        async (networkId) => {
          const provider = new ethers.JsonRpcProvider(RPC_URLS[networkId]);
          const aaveAddress = aaveConfig[networkId].poolAddress;
          const aaveContract = new ethers.Contract(
            aaveAddress,
            AAVE_POOL_ABI,
            provider,
          );
          const accountData =
            await aaveContract.getUserAccountData(walletAddress);
          return { [networkId]: accountData };
        },
      );

      const balanceData = await Promise.all(balanceDataPromises);
      const balanceDataObject = balanceData.reduce((acc, data) => {
        return { ...acc, ...data };
      }, {});

      return balanceDataObject;
    } catch (error) {
      this.portfolioLogger.error(`while getting Aave total values ${error}`);
      return null;
    }
  }

  /**
   * Fetches the total value of Zerolend protocol assets for a specific user.
   * @param walletAddress - The wallet address of the user.
   * @returns An array containing account data from Zerolend.
   */
  async getZerolendTotalValue(walletAddress: string) {
    try {
      const balanceDataPromises = Object.keys(zerolendConfig).map(
        async (networkId) => {
          const provider = new ethers.JsonRpcProvider(RPC_URLS[networkId]);
          const contractAddress = zerolendConfig[networkId].poolAddress;
          const contract = new ethers.Contract(
            contractAddress,
            ZEROLEND_POOL_ABI,
            provider,
          );
          const accountData = await contract.getUserAccountData(walletAddress);
          return { [networkId]: accountData };
        },
      );

      const balanceData = await Promise.all(balanceDataPromises);
      const balanceDataObject = balanceData.reduce((acc, data) => {
        return { ...acc, ...data };
      }, {});

      return balanceDataObject;
    } catch (error) {
      this.portfolioLogger.error(
        `while getting zerolend total values ${error}`,
      );
      return null;
    }
  }

  /**
   * Fetches the total value of Seamless protocol assets for a specific user.
   * @param walletAddress - The wallet address of the user.
   * @returns An array containing account data from Seamless.
   */
  async getSeamlessTotalValue(walletAddress: string) {
    try {
      const balanceDataPromises = Object.keys(seamlessConfig).map(
        async (networkId) => {
          const provider = new ethers.JsonRpcProvider(RPC_URLS[networkId]);
          const contractAddress = seamlessConfig[networkId].poolAddress;
          const contract = new ethers.Contract(
            contractAddress,
            SEAMLESS_POOL_ABI,
            provider,
          );
          const accountData = await contract.getUserAccountData(walletAddress);
          return { [networkId]: accountData };
        },
      );
      const balanceData = await Promise.all(balanceDataPromises);
      const balanceDataObject = balanceData.reduce((acc, data) => {
        return { ...acc, ...data };
      }, {});

      return balanceDataObject;
    } catch (error) {
      this.portfolioLogger.error(
        `while getting seamless total values ${error}`,
      );

      return null;
    }
  }

  /**
   * Calculates the sum of specific index of balances array.
   * @param balances - An array of balances.
   * @param index - The index to sum up in each balance entry.
   * @returns The total sum as a string.
   */
  private calculateTotal(balances: any, index: number) {
    let total = BigInt(0);

    Object.values(balances).forEach((entry: any) => {
      total += BigInt(entry[index]);
    });

    return total.toString();
  }

  private mergeBalances(balancesList: any[]): any {
    return balancesList.reduce((acc, balance) => ({ ...acc, ...balance }), {});
  }

  /**
   * Converts balances from BigInt to string format.
   * @param balance - The balance to be converted.
   * @returns The balance in string format.
   */
  private convertBalanceToStrings(balance: any): any {
    if (Array.isArray(balance)) {
      return balance.map((item) =>
        typeof item === 'bigint'
          ? item.toString()
          : this.convertBalanceToStrings(item),
      );
    } else if (typeof balance === 'bigint') {
      return balance.toString();
    } else if (typeof balance === 'object' && balance !== null) {
      return Object.entries(balance).reduce((acc, [key, value]) => {
        acc[key] = this.convertBalanceToStrings(value);
        return acc;
      }, {} as any);
    }
    return balance;
  }
}
