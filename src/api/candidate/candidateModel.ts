import { commonValidations } from "@/common/utils/commonValidation";
import { z } from "zod";

export type Candidate = z.infer<typeof CandidateSchema>;
export const CandidateSchema = z.object({
  id: z.number(),
  name: z.string().max(50),
  email: z.string().email().max(50),
  abilities: z.string().max(500),
  position: z.enum(["Desenvolvedor Front End", "Desenvolvedor Back End", "Desenvolvedor Full Stack", "UX Designer"]),
  aboutMe: z.string().max(2500),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateCandidateDto = z.infer<typeof CreateCandidateDtoSchema>;
export const CreateCandidateDtoSchema = z.object({
  name: z.string().max(50),
  email: z.string().email().max(50),
  abilities: z.string().max(500),
  position: z.enum(["Desenvolvedor Front End", "Desenvolvedor Back End", "Desenvolvedor Full Stack", "UX Designer"]),
  aboutMe: z.string().max(2500),
});

export type UpdateCandidateDto = z.infer<typeof UpdateCandidateDtoSchema>;
export const UpdateCandidateDtoSchema = z.object({
  name: z.string().max(50),
  abilities: z.string().max(500),
  position: z.enum(["Desenvolvedor Front End", "Desenvolvedor Back End", "Desenvolvedor Full Stack", "UX Designer"]),
  aboutMe: z.string().max(2500),
});

export const CreateCandidateSchema = z.object({
  body: z.object({
    name: commonValidations.name,
    email: commonValidations.email,
    abilities: commonValidations.abilities,
    position: commonValidations.position,
    aboutMe: commonValidations.aboutMe,
  }),
});

export const GetCandidateSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const UpdateCandidateSchema = z.object({
  params: z.object({ id: commonValidations.id }),
  body: z.object({
    name: commonValidations.name,
    abilities: commonValidations.abilities,
    position: commonValidations.position,
    aboutMe: commonValidations.aboutMe,
  }),
});
