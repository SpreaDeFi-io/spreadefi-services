import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

export const ApiSendOkResponse = (description: string, type: any) =>
  applyDecorators(ApiOkResponse({ description, status: HttpStatus.OK, type }));

export const ApiSendBadRequestResponse = (description: string, type: any) =>
  applyDecorators(
    ApiBadRequestResponse({
      description,
      status: HttpStatus.BAD_REQUEST,
      type,
    }),
  );

export const ApiSendCreatedResponse = (description: string, type: any) =>
  applyDecorators(
    ApiCreatedResponse({ description, status: HttpStatus.CREATED, type }),
  );

export const ApiSendNotFoundResponse = (description: string, type: any) =>
  applyDecorators(
    ApiNotFoundResponse({
      description,
      status: HttpStatus.NOT_FOUND,
      type,
    }),
  );

export const ApiSendInternalServerErrorResponse = (
  description: string,
  type: any,
) =>
  applyDecorators(
    ApiInternalServerErrorResponse({
      description,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      type,
    }),
  );
