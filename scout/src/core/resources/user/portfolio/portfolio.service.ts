import { Injectable } from '@nestjs/common';
import { BalanceService } from '../balance/balance.service';
import { ethers } from 'ethers';
import { RPC_URLS } from 'src/common/constants';
import {
  AAVE_POOL_ABI,
  SEAMLESS_POOL_ABI,
  ZEROLEND_POOL_ABI,
} from 'src/common/constants/abi';
import { aaveConfig } from 'src/common/constants/config/aave';
import { seamlessConfig } from 'src/common/constants/config/seamless';
import { zerolendConfig } from 'src/common/constants/config/zerolend';
import { PortfolioLogger } from './portfolio.logger';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly portfolioLogger: PortfolioLogger,
  ) {}

  async getTotalBalance(address: string) {
    const [aaveBalances, zerolendBalances, seamlessBalances] =
      await Promise.all([
        this.getAaveTotalValue(address),
        this.getZerolendTotalValue(address),
        this.getSeamlessTotalValue(address),
      ]);

    //add more params here based on frontend requirement
    const totalCollateralBase = this.calculateTotal(
      [...aaveBalances, ...zerolendBalances, ...seamlessBalances],
      0,
    );
    const totalDebtBase = this.calculateTotal(
      [...aaveBalances, ...zerolendBalances, ...seamlessBalances],
      1,
    );

    return {
      totalCollateralBase: totalCollateralBase,
      totalDebtBase: totalDebtBase,
    };
  }

  async getAaveTotalValue(address: string) {
    try {
      const balancePromises = Object.keys(aaveConfig).map(async (networkId) => {
        const provider = new ethers.JsonRpcProvider(RPC_URLS[networkId]);
        const aaveAddress = aaveConfig[networkId].poolAddress;
        const aaveContract = new ethers.Contract(
          aaveAddress,
          AAVE_POOL_ABI,
          provider,
        );
        const accData = await aaveContract.getUserAccountData(address);
        return accData;
      });

      const balances = await Promise.all(balancePromises);
      return balances;
    } catch (error) {
      this.portfolioLogger.error(`while getting Aave total values ${error}`);
      return null;
    }
  }

  async getZerolendTotalValue(address: string) {
    try {
      const balancePromises = Object.keys(zerolendConfig).map(
        async (networkId) => {
          const provider = new ethers.JsonRpcProvider(RPC_URLS[networkId]);
          const contractAddress = zerolendConfig[networkId].poolAddress;
          const contract = new ethers.Contract(
            contractAddress,
            ZEROLEND_POOL_ABI,
            provider,
          );
          const accData = await contract.getUserAccountData(address);
          return accData;
        },
      );

      const balances = await Promise.all(balancePromises);
      return balances;
    } catch (error) {
      this.portfolioLogger.error(
        `while getting zerolend total values ${error}`,
      );
      return null;
    }
  }

  async getSeamlessTotalValue(address: string) {
    try {
      const balancePromises = Object.keys(seamlessConfig).map(
        async (networkId) => {
          const provider = new ethers.JsonRpcProvider(RPC_URLS[networkId]);
          const contractAddress = seamlessConfig[networkId].poolAddress;
          const contract = new ethers.Contract(
            contractAddress,
            SEAMLESS_POOL_ABI,
            provider,
          );
          const accData = await contract.getUserAccountData(address);
          return accData;
        },
      );
      const balances = await Promise.all(balancePromises);
      return balances;
    } catch (error) {
      this.portfolioLogger.error(
        `while getting seamless total values ${error}`,
      );

      return null;
    }
  }

  private calculateTotal(balances: any[], index: number) {
    let total = BigInt(0);

    balances.forEach((balance) => {
      total += BigInt(balance[index]);
    });

    return total.toString();
  }
}
