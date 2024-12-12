import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponses } from "@/api-docs/openAPIResponseBuilders";
import {
  CandidateSchema,
  CreateCandidateSchema,
  GetCandidateSchema,
  UpdateCandidateSchema,
} from "@/api/candidate/candidateModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { StatusCodes } from "http-status-codes";
import { candidateController } from "./candidateController";

export const candidateRegistry = new OpenAPIRegistry();
export const candidateRouter: Router = express.Router();

candidateRegistry.register("Candidate", CandidateSchema);

candidateRouter.post("/", validateRequest(CreateCandidateSchema), candidateController.createCandidate);
candidateRegistry.registerPath({
  method: "post",
  path: "/candidates",
  operationId: "createCandidate",
  description: "Create a candidate.",
  summary: "Create Candidate",
  tags: ["Candidate"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: CreateCandidateSchema.shape.body },
      },
    },
  },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.CREATED,
      description: "Candidate successfully created.",
      schema: CandidateSchema,
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied.",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while creating the candidate.",
    },
  ]),
});

candidateRouter.get("/", candidateController.getCandidates);
candidateRegistry.registerPath({
  method: "get",
  path: "/candidates",
  operationId: "findAllCandidates",
  description: "Retrieve all candidates.",
  summary: "Get all Candidates",
  tags: ["Candidate"],
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "All candidates successfully found.",
      schema: z.array(CandidateSchema),
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "No candidates found.",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while retrieving all candidates.",
    },
  ]),
});

candidateRouter.get("/:id", validateRequest(GetCandidateSchema), candidateController.getCandidate);
candidateRegistry.registerPath({
  method: "get",
  path: "/candidates/{id}",
  operationId: "findCandidateById",
  description: "Retrieve a candidate by their ID.",
  summary: "Get Candidate",
  tags: ["Candidate"],
  request: { params: GetCandidateSchema.shape.params },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "Candidate successfully found.",
      schema: CandidateSchema,
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied.",
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "Candidate not found.",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while finding the candidate.",
    },
  ]),
});

candidateRouter.put("/:id", validateRequest(UpdateCandidateSchema), candidateController.updateCandidate);
candidateRegistry.registerPath({
  method: "put",
  path: "/candidates/{id}",
  operationId: "updateCandidate",
  description: "Update a candidate by their ID.",
  summary: "Update Candidate",
  tags: ["Candidate"],
  request: {
    params: UpdateCandidateSchema.shape.params,
    body: {
      required: true,
      content: {
        "application/json": { schema: UpdateCandidateSchema.shape.body },
      },
    },
  },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "Candidate successfully updated.",
      schema: z.null(),
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied.",
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "Candidate not found.",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while updating the candidate.",
    },
  ]),
});

candidateRouter.delete("/:id", validateRequest(GetCandidateSchema), candidateController.deleteCandidate);
candidateRegistry.registerPath({
  method: "delete",
  path: "/candidates/{id}",
  operationId: "deleteCandidate",
  description: "Delete a candidate by their ID.",
  summary: "Delete Candidate",
  tags: ["Candidate"],
  request: { params: GetCandidateSchema.shape.params },
  responses: createApiResponses([
    {
      statusCode: StatusCodes.OK,
      description: "Candidate successfully deleted.",
      schema: z.null(),
    },
    {
      statusCode: StatusCodes.BAD_REQUEST,
      description: "Invalid data supplied.",
    },
    {
      statusCode: StatusCodes.NOT_FOUND,
      description: "Candidate not found.",
    },
    {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      description: "An error occurred while deleting the candidate.",
    },
  ]),
});
