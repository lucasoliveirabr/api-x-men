import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetCandidateSchema, CandidateSchema } from "@/api/candidate/candidateModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { candidateController } from "./candidateController";

export const candidateRegistry = new OpenAPIRegistry();
export const candidateRouter: Router = express.Router();

candidateRegistry.register("Candidate", CandidateSchema);

candidateRegistry.registerPath({
  method: "post",
  path: "/candidates",
  tags: ["Candidate"],
  responses: createApiResponse(z.array(CandidateSchema), "Success"),
});
candidateRouter.post("/", candidateController.createCandidate);

candidateRegistry.registerPath({
  method: "get",
  path: "/candidates",
  tags: ["Candidate"],
  responses: createApiResponse(z.array(CandidateSchema), "Success"),
});
candidateRouter.get("/", candidateController.getCandidates);

candidateRegistry.registerPath({
  method: "get",
  path: "/candidates/{id}",
  tags: ["Candidate"],
  request: { params: GetCandidateSchema.shape.params },
  responses: createApiResponse(CandidateSchema, "Success"),
});
candidateRouter.get("/:id", validateRequest(GetCandidateSchema), candidateController.getCandidate);
