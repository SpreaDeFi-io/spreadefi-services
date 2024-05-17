import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { getAddress } from 'ethers';
import { Observable } from 'rxjs';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    request.body.assetAddress = getAddress(request.body.assetAddress);

    return next.handle();
  }
}
