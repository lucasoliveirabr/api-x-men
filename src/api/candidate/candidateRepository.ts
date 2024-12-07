import type { Candidate, CreateCandidateDto } from "@/api/candidate/candidateModel";

export const candidates: Candidate[] = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    abilities: "Habilidade1, Habilidade2, Habilidade3",
    position: "Desenvolvedor Back End",
    aboutMe: "Pessoa habilidosa",
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    name: "Robert",
    email: "Robert@example.com",
    abilities: "Habilidade1, Habilidade2, Habilidade3",
    position: "Desenvolvedor Front End",
    aboutMe: "Pessoa habilidosa",
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
];

export class CandidateRepository {
  async createAsync(candidateToBeCreated: CreateCandidateDto): Promise<CreateCandidateDto> {
    candidates.push({
      id: Date.now(),
      ...candidateToBeCreated,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return candidateToBeCreated;
  }

  async findAllAsync(): Promise<Candidate[]> {
    return candidates;
  }

  async findByIdAsync(id: number): Promise<Candidate | null> {
    return candidates.find((candidate) => candidate.id === id) || null;
  }
}
