import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BytesLike } from 'ethers';
import { ENSO_URL } from 'src/common/constants';
import { Action, ExecutableTransaction } from 'src/common/types';

@Injectable()
export class EnsoService {
  constructor(private readonly configService: ConfigService) {}

  //*Fetches the enso approval transaction
  async approveEnso(
    sender: string,
    chainId: string,
    inputToken: string,
    inputAmount: string,
  ) {
    const data = await fetch(
      `${ENSO_URL}/wallet/approve?chainId=${chainId}&fromAddress=${sender}&tokenAddress=${inputToken}&amount=${inputAmount}&routingStrategy=router`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('ENSO_API_KEY')}`,
        },
      },
    );

    const response = await data.json();

    if (response.statusCode && response.statusCode !== 200)
      throw new BadRequestException(response.message);

    return response;
  }

  //* Creates the approval transaction data of type ExecutableTransaction
  async createApproveTransaction(
    sender: string,
    chainId: string,
    inputToken: string,
    inputAmount: string,
  ) {
    try {
      const data = await this.approveEnso(
        sender,
        chainId,
        inputToken,
        inputAmount,
      );

      return {
        chain: chainId,
        type: Action.APPROVE,
        tx: data.tx.data as BytesLike,
        to: data.tx.to as string,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //*Gets the enso quote for specified inputToken and inputAmount
  async getQuote(
    sender: string,
    chainId: string,
    inputToken: string,
    inputAmount: string,
    outputToken: string,
  ) {
    const data = await fetch(
      `${ENSO_URL}/shortcuts/quote?chainId=${chainId}&fromAddress=${sender}&routingStrategy=router&tokenIn=${inputToken}&tokenOut=${outputToken}&amountIn=${inputAmount}`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('ENSO_API_KEY')}`,
        },
      },
    );

    const response = await data.json();

    if (response.statusCode && response.statusCode !== 200)
      throw new BadRequestException(response.message);

    return response;
  }

  //*Creates the executable transaction bytes of enso
  async prepareTransaction(
    sender: string,
    chainId: string,
    receiver: string,
    inputToken: string,
    inputAmount: string,
    outputToken: string,
    toEOA: boolean,
    slippage?: number,
  ) {
    const quote = await this.getQuote(
      sender,
      chainId,
      inputToken,
      inputAmount,
      outputToken,
    );

    const data = await fetch(`${ENSO_URL}/shortcuts/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.configService.get<string>('ENSO_API_KEY')}`,
      },
      body: JSON.stringify({
        chainId: Number(chainId),
        fromAddress: sender,
        routingStrategy: 'router',
        toEOA,
        receiver,
        spender: sender,
        amountIn: [inputAmount],
        amountOut: [quote.amountOut],
        slippage: slippage?.toString() ?? '150', //slippage or 1.5%
        tokenIn: [inputToken],
        tokenOut: [outputToken],
      }),
    });

    const response = await data.json();

    if (response.statusCode && response.statusCode !== 200)
      throw new BadRequestException(response.message);

    return response;
  }

  //*Creates the executable enso transaction of type ExecutableTransaction
  async createExecutableTransaction(
    sender: string,
    chainId: string,
    receiver: string,
    inputToken: string,
    inputAmount: string,
    outputToken: string,
    toEOA: boolean,
    slippage?: number,
  ): Promise<ExecutableTransaction> {
    try {
      const data = await this.prepareTransaction(
        sender,
        chainId,
        receiver,
        inputToken,
        inputAmount,
        outputToken,
        toEOA,
        slippage,
      );

      return {
        chain: chainId,
        type: Action.ENSO,
        tx: data.tx.data,
        to: data.tx.to,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
