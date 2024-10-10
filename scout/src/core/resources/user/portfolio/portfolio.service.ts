import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { CHAINS, chainToChainIdPortals, RPC_URLS } from 'src/common/constants';
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
import { AssetRepository } from '../../asset/asset.repository';
import { ProtocolType } from '../../asset/asset.schema';
import { PortalsService } from 'src/libs/portals/portals.service';
import { lendleConfig } from 'src/common/constants/config/lendle';
import { LENDLE_POOL_ABI } from 'src/common/constants/abi/lendle';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly covalentService: CovalentService,
    private readonly portfolioLogger: PortfolioLogger,
    private readonly assetRepository: AssetRepository,
    private readonly portalsService: PortalsService,
  ) {}

  /**
   * Fetches the total balance present in the wallet, total collateral, and debt across all protocols for a user's wallet.
   * @param walletAddress - The wallet address of the user.
   * @returns An object containing totalCollateralBase, totalDebtBase, and totalBalanceUSD.
   */
  async getTotalBalance(walletAddress: string) {
    try {
      const [
        aaveBalances,
        zerolendBalances,
        seamlessBalances,
        lendleBalances,
        yieldBalances,
      ] = await Promise.all([
        this.getAaveTotalValue(walletAddress),
        this.getZerolendTotalValue(walletAddress),
        this.getSeamlessTotalValue(walletAddress),
        this.getLendleTotalValue(walletAddress),
        this.getYieldProtocolsTotalValue(walletAddress),
      ]);

      const mergedBalance = [
        aaveBalances,
        zerolendBalances,
        seamlessBalances,
        lendleBalances,
      ];
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
        totalYieldBalance: yieldBalances.totalYieldBalance,
        totalBalanceUSD: totalBalanceUSD,
        chainBalance: this.convertBalanceToStrings(chainBalance),
        aaveBalances: this.convertBalanceToStrings(aaveBalances),
        seamlessBalances: this.convertBalanceToStrings(seamlessBalances),
        zerolendBalances: this.convertBalanceToStrings(zerolendBalances),
        lendleBalances: this.convertBalanceToStrings(lendleBalances),
      };
    } catch (error: any) {
      console.log('error: ', error);
    }
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

  async getLendleTotalValue(walletAddress: string) {
    try {
      const balanceDataPromises = Object.keys(lendleConfig).map(
        async (networkId) => {
          const provider = new ethers.JsonRpcProvider(RPC_URLS[networkId]);
          const contractAddress = lendleConfig[networkId].poolAddress;
          const contract = new ethers.Contract(
            contractAddress,
            LENDLE_POOL_ABI,
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

      const balanceObjectFormatted = {};

      Object.keys(balanceDataObject).forEach((key) => {
        // Access the array for each key
        const arr = balanceDataObject[key];

        balanceObjectFormatted[key] = [
          arr[0].toString().length > 10
            ? BigInt(arr[0].toString().slice(0, -10))
            : arr[0],
          arr[1].toString().length > 10
            ? BigInt(arr[1].toString()?.substring(0, -10))
            : arr[1],
        ].concat(arr.slice(2));
      });

      return balanceObjectFormatted;
    } catch (error) {
      this.portfolioLogger.error(`while getting Lendle total values ${error}`);
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
   * Fetches the balance of all the tokens that are of yield category and are supported by portals
   * @param walletAddress address of the owner
   * @returns the balance of all the yield tokens supported by portals
   */
  async getYieldProtocolsTotalValue(walletAddress: string) {
    const protocols = await this.assetRepository.getProtocols();

    const yieldProtocols = protocols.filter(
      (protocol) =>
        protocol.protocolType === ProtocolType.YIELD &&
        protocol.protocolName !== 'beefy',
    );

    const networks = Object.keys(chainToChainIdPortals);

    const tokenBalances = await this.portalsService.getBalance(
      walletAddress,
      networks,
    );

    const yieldTokenBalances = tokenBalances.filter(
      (token) =>
        yieldProtocols.some(
          (protocol) => protocol.protocolName === token.platform,
        ) || token.platform === 'beefy',
    );

    let totalYieldBalance = 0;

    yieldTokenBalances.forEach(
      (token) => (totalYieldBalance += token.balanceUSD),
    );

    // const yieldTokensByProtocol = [];

    // yieldTokenBalances.forEach((token1) => {
    //   const existingProtocol = yieldTokensByProtocol.find(
    //     (token2) =>
    //       token1.platform === token2.protocol &&
    //       chainToChainIdPortals[token1.network] === token2.chainId,
    //   );

    //   if (existingProtocol) {
    //     existingProtocol.assets.push(token1);
    //   } else {
    //     yieldTokensByProtocol.push({
    //       assets: [token1],
    //       chainId: chainToChainIdPortals[token1.network],
    //       protocol: token1.platform,
    //     });
    //   }
    // });

    return { totalYieldBalance };
  }

  /**
   * Calculates the sum of specific index of balances array.
   * @param balances - An array of balances.
   * @param index - The index to sum up in each balance entry.
   * @returns The total sum as a string.
   */
  private calculateTotal(balances: any, index: number) {
    let total = BigInt(0);

    balances.forEach((obj: any) => {
      for (const key in obj) {
        total += obj[key][index];
      }
    });

    return total.toString();
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
