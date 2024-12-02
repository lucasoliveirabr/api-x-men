import type { StatusCodes } from "http-status-codes";
import type { z } from "zod";

import { ServiceResponseSchema } from "@/common/models/serviceResponse";

import type { ResponseConfig } from "@asteasolutions/zod-to-openapi";
export type ApiResponseConfig = {
  schema?: z.ZodTypeAny;
  description: string;
  statusCode: StatusCodes;
};

export function createApiResponse(statusCode: number, description: string, schema?: z.ZodTypeAny) {
  if (schema) {
    return {
      [statusCode]: {
        description,
        content: {
          "application/json": {
            schema: ServiceResponseSchema(schema),
          },
        },
      },
    };
  } else {
    return {
      [statusCode]: {
        description,
      },
    };
  }
}

export function createApiResponses(configs: ApiResponseConfig[]) {
  const responses: { [key: string]: ResponseConfig } = {};
  configs.forEach(({ statusCode, description, schema }) => {
    if (schema) {
      responses[statusCode] = {
        description,
        content: {
          "application/json": {
            schema: ServiceResponseSchema(schema),
          },
        },
      };
    } else {
      responses[statusCode] = {
        description,
      };
    }
  });
  return responses;
}
