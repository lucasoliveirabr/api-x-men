import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { Candidate } from "@/api/candidate/candidateModel";
import { candidates } from "@/api/candidate/candidateRepository";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";

describe("Candidate API Endpoints", () => {
  describe("GET /candidates", () => {
    it("should return a list of candidates", async () => {
      // Act
      const response = await request(app).get("/candidates");
      const responseBody: ServiceResponse<Candidate[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("All candidates successfully found.");
      expect(responseBody.responseObject.length).toEqual(candidates.length);
      responseBody.responseObject.forEach((candidate, index) => compareCandidates(candidates[index] as Candidate, candidate));
    });
  });

  describe("GET /candidates/:id", () => {
    it("should return a candidate for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const expectedCandidate = candidates.find((candidate) => candidate.id === testId) as Candidate;

      // Act
      const response = await request(app).get(`/candidates/${testId}`);
      const responseBody: ServiceResponse<Candidate> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Candidate successfully found.");
      if (!expectedCandidate) throw new Error("Invalid test data: expectedCandidate is undefined");
      compareCandidates(expectedCandidate, responseBody.responseObject);
    });

    it("should return a not found error for non-existent ID", async () => {
      // Arrange
      const testId = Number.MAX_SAFE_INTEGER;

      // Act
      const response = await request(app).get(`/candidates/${testId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Candidate not found.");
      expect(responseBody.responseObject).toBeNull();
    });

    it("should return a bad request for invalid ID format", async () => {
      // Act
      const invalidInput = "abc";
      const response = await request(app).get(`/candidates/${invalidInput}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Invalid input: ID must be a numeric value, ID must be a positive number.");
      expect(responseBody.responseObject).toBeNull();
    });
  });
});

function compareCandidates(mockCandidate: Candidate, responseCandidate: Candidate) {
  if (!mockCandidate || !responseCandidate) {
    throw new Error("Invalid test data: mockCandidate or responseCandidate is undefined");
  }

  expect(responseCandidate.id).toEqual(mockCandidate.id);
  expect(responseCandidate.name).toEqual(mockCandidate.name);
  expect(responseCandidate.email).toEqual(mockCandidate.email);
  expect(responseCandidate.abilities).toEqual(mockCandidate.abilities);
  expect(responseCandidate.position).toEqual(mockCandidate.position);
  expect(responseCandidate.aboutMe).toEqual(mockCandidate.aboutMe);
  expect(new Date(responseCandidate.createdAt)).toEqual(mockCandidate.createdAt);
  expect(new Date(responseCandidate.updatedAt)).toEqual(mockCandidate.updatedAt);
}
