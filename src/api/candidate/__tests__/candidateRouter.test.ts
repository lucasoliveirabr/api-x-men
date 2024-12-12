import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { Candidate, CreateCandidateDto, UpdateCandidateDto } from "@/api/candidate/candidateModel";
import { candidates } from "@/api/candidate/candidateRepository";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";

describe("Candidate API Endpoints", () => {
  describe("POST /candidates", () => {
    it("should return a candidate for valid data", async () => {
      const testCandidate: CreateCandidateDto = {
        name: "Michael",
        email: "michael@example.com",
        abilities: "Habilidade1, Habilidade2, Habilidade3",
        position: "Desenvolvedor Full Stack",
        aboutMe: "Pessoa habilidosa",
      };

      const response = await request(app).post("/candidates").send(testCandidate);
      const responseBody: ServiceResponse<Candidate> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.CREATED);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).equals("Candidate successfully created.");
    });

    it("should return a bad request error for invalid data", async () => {
      const testCandidate: CreateCandidateDto = {
        name: "Michael",
        email: "michaelexamplecom",
        abilities: "Habilidade1, Habilidade2, Habilidade3",
        position: "Desenvolvedor Full Stack",
        aboutMe: "Pessoa habilidosa",
      };

      const response = await request(app).post("/candidates").send(testCandidate);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Invalid data supplied:");
      expect(responseBody.responseObject).toBeNull();
    });
  });

  describe("GET /candidates", () => {
    it("should return a list of all candidates", async () => {
      const response = await request(app).get("/candidates");
      const responseBody: ServiceResponse<Candidate[]> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).equals("All candidates successfully found.");
      expect(responseBody.responseObject.length).toEqual(candidates.length);
      responseBody.responseObject.forEach((candidate, index) =>
        compareCandidates(candidates[index] as Candidate, candidate),
      );
    });
  });

  describe("GET /candidates/:id", () => {
    it("should return a candidate for a valid ID", async () => {
      const testId = 1;
      const expectedCandidate = candidates.find((candidate) => candidate.id === testId) as Candidate;

      const response = await request(app).get(`/candidates/${testId}`);
      const responseBody: ServiceResponse<Candidate> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).equals("Candidate successfully found.");
      if (!expectedCandidate) throw new Error("Invalid test data: expectedCandidate is undefined.");
      compareCandidates(expectedCandidate, responseBody.responseObject);
    });

    it("should return a bad request error for invalid data", async () => {
      const invalidInput = "abc";

      const response = await request(app).get(`/candidates/${invalidInput}`);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).equals(
        "Invalid data supplied: id: ID must be a numeric value, id: ID must be a positive number.",
      );
      expect(responseBody.responseObject).toBeNull();
    });

    it("should return a not found error for non-existent ID", async () => {
      const testId = Number.MAX_SAFE_INTEGER;

      const response = await request(app).get(`/candidates/${testId}`);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).equals("Candidate not found.");
      expect(responseBody.responseObject).toBeNull();
    });
  });

  describe("PUT /candidates/:id", () => {
    it("should return successfully for valid data", async () => {
      const testId = 1;
      const testCandidate: UpdateCandidateDto = {
        name: "Alice Silva",
        abilities: "Habilidade1, Habilidade2, Habilidade3, Habilidade4",
        position: "Desenvolvedor Full Stack",
        aboutMe: "Pessoa muito habilidosa",
      };

      const response = await request(app).put(`/candidates/${testId}`).send(testCandidate);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).equals("Candidate successfully updated.");
      expect(responseBody.responseObject).toBeNull();
    });

    it("should return a bad request error for invalid data", async () => {
      const testId = "abc";
      const testCandidate: UpdateCandidateDto = {
        name: "Lorem ipsum dolor sit amet, consectetuer adipiscing",
        abilities: "Habilidade1, Habilidade2, Habilidade3, Habilidade4",
        position: "Desenvolvedor Full Stack",
        aboutMe: "Pessoa muito habilidosa",
      };

      const response = await request(app).put(`/candidates/${testId}`).send(testCandidate);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Invalid data supplied:");
      expect(responseBody.responseObject).toBeNull();
    });

    it("should return a not found error for non-existent ID", async () => {
      const testId = Number.MAX_SAFE_INTEGER;
      const testCandidate: UpdateCandidateDto = {
        name: "Alice Silva",
        abilities: "Habilidade1, Habilidade2, Habilidade3, Habilidade4",
        position: "Desenvolvedor Full Stack",
        aboutMe: "Pessoa muito habilidosa",
      };

      const response = await request(app).put(`/candidates/${testId}`).send(testCandidate);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).equals("Candidate not found.");
      expect(responseBody.responseObject).toBeNull();
    });
  });

  describe("DELETE /candidates/:id", () => {
    it("should return successfully for valid data", async () => {
      const testId = 1;

      const response = await request(app).delete(`/candidates/${testId}`);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).equals("Candidate successfully deleted.");
      expect(responseBody.responseObject).toBeNull();
    });

    it("should return a bad request error for invalid data", async () => {
      const invalidInput = "abc";

      const response = await request(app).delete(`/candidates/${invalidInput}`);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Invalid data supplied:");
      expect(responseBody.responseObject).toBeNull();
    });

    it("should return a not found error for non-existent ID", async () => {
      const testId = Number.MAX_SAFE_INTEGER;

      const response = await request(app).delete(`/candidates/${testId}`);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).equals("Candidate not found.");
      expect(responseBody.responseObject).toBeNull();
    });
  });
});

function compareCandidates(mockCandidate: Candidate, responseCandidate: Candidate) {
  if (!mockCandidate || !responseCandidate) {
    throw new Error("Invalid test data: mockCandidate or responseCandidate is undefined.");
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
