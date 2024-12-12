import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import type { Candidate, CreateCandidateDto, UpdateCandidateDto } from "@/api/candidate/candidateModel";
import { CandidateRepository } from "@/api/candidate/candidateRepository";
import { CandidateService } from "@/api/candidate/candidateService";

vi.mock("@/api/candidate/candidateRepository");

describe("candidateService", () => {
  let candidateServiceInstance: CandidateService;
  let candidateRepositoryInstance: CandidateRepository;

  let mockCandidates: Candidate[] = [
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      abilities: "Habilidade1, Habilidade2, Habilidade3",
      position: "Desenvolvedor Back End",
      aboutMe: "Pessoa habilidosa",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Robert",
      email: "Robert@example.com",
      abilities: "Habilidade1, Habilidade2, Habilidade3",
      position: "Desenvolvedor Front End",
      aboutMe: "Pessoa habilidosa",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    candidateRepositoryInstance = new CandidateRepository();
    candidateServiceInstance = new CandidateService(candidateRepositoryInstance);
  });

  describe("create", () => {
    it("returns a candidate for valid data", async () => {
      const testCandidate: CreateCandidateDto = {
        name: "Michael",
        email: "michael@example.com",
        abilities: "Habilidade1, Habilidade2, Habilidade3",
        position: "Desenvolvedor Full Stack",
        aboutMe: "Pessoa habilidosa",
      };
      const newCandidate: Candidate = {
        id: Date.now(),
        ...testCandidate,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCandidates.push(newCandidate);
      (candidateRepositoryInstance.createAsync as Mock).mockReturnValue(newCandidate);
      const result = await candidateServiceInstance.create(testCandidate);

      expect(result.statusCode).toEqual(StatusCodes.CREATED);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Candidate successfully created.");
      expect(result.responseObject).toEqual(newCandidate);
    });

    it("returns a bad request error for invalid data", async () => {
      const testCandidate: CreateCandidateDto = {
        name: "Michael",
        email: "michaelexamplecom",
        abilities: "Habilidade1, Habilidade2, Habilidade3",
        position: "Desenvolvedor Full Stack",
        aboutMe: "Pessoa habilidosa",
      };

      const result = await candidateServiceInstance.create(testCandidate);

      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain("Invalid data supplied:");
      expect(result.responseObject).toBeNull();
    });

    it("returns a internal server error", async () => {
      const testCandidate: CreateCandidateDto = {
        name: "Michael",
        email: "michael@example.com",
        abilities: "Habilidade1, Habilidade2, Habilidade3",
        position: "Desenvolvedor Full Stack",
        aboutMe: "Pessoa habilidosa",
      };
      (candidateRepositoryInstance.createAsync as Mock).mockRejectedValue(new Error("Database error"));

      const result = await candidateServiceInstance.create(testCandidate);

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while creating the candidate.");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findAll", () => {
    it("returns all candidates", async () => {
      (candidateRepositoryInstance.findAllAsync as Mock).mockReturnValue(mockCandidates);

      const result = await candidateServiceInstance.findAll();

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("All candidates successfully found.");
      expect(result.responseObject).toEqual(mockCandidates);
    });

    it("returns a not found error for no candidates found", async () => {
      (candidateRepositoryInstance.findAllAsync as Mock).mockReturnValue(null);

      const result = await candidateServiceInstance.findAll();

      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("No candidates found.");
      expect(result.responseObject).toBeNull();
    });

    it("returns a internal server error", async () => {
      (candidateRepositoryInstance.findAllAsync as Mock).mockRejectedValue(new Error("Database error"));

      const result = await candidateServiceInstance.findAll();

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while retrieving all candidates.");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findById", () => {
    it("returns a candidate for a valid ID", async () => {
      const testId = 1;
      const mockCandidate = mockCandidates.find((candidate) => candidate.id === testId);
      (candidateRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mockCandidate);

      const result = await candidateServiceInstance.findById(testId);

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Candidate successfully found.");
      expect(result.responseObject).toEqual(mockCandidate);
    });

    it("returns a bad request error for invalid data", async () => {
      const testId = "abc";
      const testIdAsNumber = Number.parseInt(testId, 10);

      const result = await candidateServiceInstance.findById(testIdAsNumber);

      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain("Invalid data supplied:");
      expect(result.responseObject).toBeNull();
    });

    it("returns a not found error for non-existent ID", async () => {
      const testId = Number.MAX_SAFE_INTEGER;
      (candidateRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      const result = await candidateServiceInstance.findById(testId);

      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("Candidate not found.");
      expect(result.responseObject).toBeNull();
    });

    it("returns a internal server error", async () => {
      const testId = 1;
      (candidateRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(new Error("Database error"));

      const result = await candidateServiceInstance.findById(testId);

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while finding the candidate.");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("update", () => {
    it("returns successfully for valid data", async () => {
      const testId = 1;
      const testCandidate: UpdateCandidateDto = {
        name: "Alice Silva",
        abilities: "Habilidade1, Habilidade2, Habilidade3, Habilidade4",
        position: "Desenvolvedor Full Stack",
        aboutMe: "Pessoa muito habilidosa",
      };
      const mockCandidate = mockCandidates.find((candidate) => candidate.id === testId);
      (candidateRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mockCandidate);

      mockCandidates = mockCandidates.map((candidate) =>
        candidate.id === testId ? { ...candidate, ...testCandidate, updatedAt: new Date() } : candidate,
      );
      const result = await candidateServiceInstance.update(testId, testCandidate);

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Candidate successfully updated.");
      expect(result.responseObject).toBeNull();
    });

    it("returns a bad request error for invalid data", async () => {
      const testId = "abc";
      const testIdAsNumber = Number.parseInt(testId, 10);
      const testCandidate: UpdateCandidateDto = {
        name: "Lorem ipsum dolor sit amet, consectetuer adipiscing",
        abilities: "Habilidade1, Habilidade2, Habilidade3, Habilidade4",
        position: "Desenvolvedor Full Stack",
        aboutMe: "Pessoa muito habilidosa",
      };

      const result = await candidateServiceInstance.update(testIdAsNumber, testCandidate);

      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain("Invalid data supplied:");
      expect(result.responseObject).toBeNull();
    });

    it("returns a not found error for non-existent ID", async () => {
      const testId = Number.MAX_SAFE_INTEGER;
      const testCandidate: UpdateCandidateDto = {
        name: "Alice Silva",
        abilities: "Habilidade1, Habilidade2, Habilidade3, Habilidade4",
        position: "Desenvolvedor Full Stack",
        aboutMe: "Pessoa muito habilidosa",
      };
      (candidateRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      const result = await candidateServiceInstance.update(testId, testCandidate);

      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("Candidate not found.");
      expect(result.responseObject).toBeNull();
    });

    it("returns a internal server error", async () => {
      const testId = 1;
      const testCandidate: UpdateCandidateDto = {
        name: "Alice Silva",
        abilities: "Habilidade1, Habilidade2, Habilidade3, Habilidade4",
        position: "Desenvolvedor Full Stack",
        aboutMe: "Pessoa muito habilidosa",
      };
      (candidateRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(new Error("Database error"));

      const result = await candidateServiceInstance.update(testId, testCandidate);

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while updating the candidate.");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("delete", () => {
    it("returns successfully for valid data", async () => {
      const testId = 1;
      const mockCandidate = mockCandidates.find((candidate) => candidate.id === testId);
      (candidateRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mockCandidate);

      const result = await candidateServiceInstance.delete(testId);

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Candidate successfully deleted.");
      expect(result.responseObject).toBeNull();
    });

    it("returns a bad request error for invalid data", async () => {
      const testId = "abc";
      const testIdAsNumber = Number.parseInt(testId, 10);

      const result = await candidateServiceInstance.delete(testIdAsNumber);

      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain("Invalid data supplied:");
      expect(result.responseObject).toBeNull();
    });

    it("returns a not found error for non-existent ID", async () => {
      const testId = Number.MAX_SAFE_INTEGER;
      (candidateRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      const result = await candidateServiceInstance.delete(testId);

      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("Candidate not found.");
      expect(result.responseObject).toBeNull();
    });

    it("returns a internal server error", async () => {
      const testId = 1;
      (candidateRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(new Error("Database error"));

      const result = await candidateServiceInstance.delete(testId);

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while deleting the candidate.");
      expect(result.responseObject).toBeNull();
    });
  });
});
