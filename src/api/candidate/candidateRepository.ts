import type { Candidate, CreateCandidateDto, UpdateCandidateDto } from "@/api/candidate/candidateModel";

export let candidates: Candidate[] = [
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
  async createAsync(candidateToBeCreated: CreateCandidateDto): Promise<Candidate> {
    const newCandidate: Candidate = {
      id: Date.now(),
      ...candidateToBeCreated,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    candidates.push(newCandidate);
    return newCandidate;
  }

  async findAllAsync(): Promise<Candidate[] | null> {
    return candidates;
  }

  async findByIdAsync(id: number): Promise<Candidate | null> {
    return candidates.find((candidate) => candidate.id === id) || null;
  }

  async updateAsync(id: number, newCandidateData: UpdateCandidateDto) {
    candidates = candidates.map((candidate) =>
      candidate.id === id ? { ...candidate, ...newCandidateData, updatedAt: new Date() } : candidate,
    );
  }

  async deleteAsync(id: number) {
    candidates = candidates.filter((candidate) => candidate.id !== id);
  }
}
