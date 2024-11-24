import { StatusCodes } from "http-status-codes";

import type { Candidate } from "@/api/candidate/candidateModel";
import { CandidateRepository } from "@/api/candidate/candidateRepository";
// import { DatabaseService } from "@common/database/databaseService";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class CandidateService {
  private candidateRepository: CandidateRepository;

  constructor(repository: CandidateRepository = new CandidateRepository()) {
    this.candidateRepository = repository;
  }

  async findAll(): Promise<ServiceResponse<Candidate[] | null>> {
    try {
      const candidates = await this.candidateRepository.findAllAsync();
      if (!candidates || candidates.length === 0) {
        return ServiceResponse.failure("No candidates found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Candidate[]>("Candidates found", candidates);
    } catch (ex) {
      const errorMessage = `Error finding all candidates: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving candidates.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<Candidate | null>> {
    try {
      const candidate = await this.candidateRepository.findByIdAsync(id);
      if (!candidate) {
        return ServiceResponse.failure("Candidate not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Candidate>("Candidate found", candidate);
    } catch (ex) {
      const errorMessage = `Error finding candidate with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding candidate.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const candidateService = new CandidateService();
