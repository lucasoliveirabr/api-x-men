import { StatusCodes } from "http-status-codes";

import { type Candidate, type CreateCandidateDto, CreateCandidateDtoSchema } from "@/api/candidate/candidateModel";
import { CandidateRepository } from "@/api/candidate/candidateRepository";
// import { DatabaseService } from "@common/database/databaseService";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class CandidateService {
  private candidateRepository: CandidateRepository;

  constructor(repository: CandidateRepository = new CandidateRepository()) {
    this.candidateRepository = repository;
  }

  async create(candidateToBeCreated: CreateCandidateDto): Promise<ServiceResponse<CreateCandidateDto | null>> {
    try {
      const validationResult = CreateCandidateDtoSchema.safeParse(candidateToBeCreated);
      if (!validationResult.success) {
        const errorMessages = validationResult.error.errors
          .map((error) => `${error.path.join(".")}: ${error.message}`)
          .join("; ");
        logger.error(`Invalid data supplied: ${errorMessages}.`);
        return ServiceResponse.failure(`Invalid data supplied: ${errorMessages}.`, null, StatusCodes.BAD_REQUEST);
      }

      const candidate = await this.candidateRepository.createAsync(candidateToBeCreated);
      return ServiceResponse.success<CreateCandidateDto>(
        "Candidate successfully created.",
        candidate,
        StatusCodes.CREATED,
      );
    } catch (ex) {
      const errorMessage = `Error while creating a candidate ${candidateToBeCreated}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating the candidate.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<ServiceResponse<Candidate[] | null>> {
    try {
      const candidates = await this.candidateRepository.findAllAsync();
      if (!candidates || candidates.length === 0) {
        return ServiceResponse.failure("No candidates found.", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Candidate[]>("All candidates successfully found.", candidates, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error while finding all candidates: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving all candidates.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<Candidate | null>> {
    try {
      if (Number.isNaN(id)) {
        return ServiceResponse.failure(
          "Invalid data supplied: id: ID must be a numeric value, id: ID must be a positive number.",
          null,
          StatusCodes.BAD_REQUEST,
        );
      }

      const candidate = await this.candidateRepository.findByIdAsync(id);
      if (!candidate) {
        return ServiceResponse.failure("Candidate not found.", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<Candidate>("Candidate successfully found.", candidate, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error while finding the candidate with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding the candidate.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const candidateService = new CandidateService();
