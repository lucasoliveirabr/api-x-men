import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import type { Candidate } from "@/api/candidate/candidateModel";
import { CandidateRepository } from "@/api/candidate/candidateRepository";
import { CandidateService } from "@/api/candidate/candidateService";

vi.mock("@/api/candidate/candidateRepository");

describe("candidateService", () => {
  let candidateServiceInstance: CandidateService;
  let candidateRepositoryInstance: CandidateRepository;

  const mockCandidates: Candidate[] = [
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

  describe("findAll", () => {
    it("return all candidates", async () => {
      // Arrange
      (candidateRepositoryInstance.findAllAsync as Mock).mockReturnValue(mockCandidates);

      // Act
      const result = await candidateServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("All candidates successfully found.");
      expect(result.responseObject).toEqual(mockCandidates);
    });

    it("returns a not found error for no candidates found", async () => {
      // Arrange
      (candidateRepositoryInstance.findAllAsync as Mock).mockReturnValue(null);

      // Act
      const result = await candidateServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("No candidates found.");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findAllAsync", async () => {
      // Arrange
      (candidateRepositoryInstance.findAllAsync as Mock).mockRejectedValue(new Error("Database error"));

      // Act
      const result = await candidateServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while retrieving all candidates.");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findById", () => {
    it("returns a candidate for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const mockCandidate = mockCandidates.find((candidate) => candidate.id === testId);
      (candidateRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mockCandidate);

      // Act
      const result = await candidateServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Candidate successfully found.");
      expect(result.responseObject).toEqual(mockCandidate);
    });

    it("returns a not found error for non-existent ID", async () => {
      // Arrange
      const testId = 1;
      (candidateRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await candidateServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("Candidate not found.");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findByIdAsync", async () => {
      // Arrange
      const testId = 1;
      (candidateRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(new Error("Database error"));

      // Act
      const result = await candidateServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while finding the candidate.");
      expect(result.responseObject).toBeNull();
    });
  });
});
