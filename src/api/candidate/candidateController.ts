import type { Request, RequestHandler, Response } from "express";

import { candidateService } from "@/api/candidate/candidateService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class CandidateController {
  public getCandidates: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await candidateService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getCandidate: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await candidateService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const candidateController = new CandidateController();