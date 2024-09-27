import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { getAddress } from 'ethers';
import { Observable } from 'rxjs';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    if (request.method === 'GET' && request.params.address) {
      request.params.fromAddress = getAddress(request.params.fromAddress);
      request.params.toAddress = getAddress(request.params.toAddress);
    }

    if (request.method === 'POST' && request.body.assetAddress) {
      request.body.fromAddress = getAddress(request.body.fromAddress);
      request.body.toAddress = getAddress(request.body.toAddress);
    }

    return next.handle();
  }
}
