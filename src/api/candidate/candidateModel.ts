import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Candidate = z.infer<typeof CandidateSchema>;
export const CandidateSchema = z.object({
  id: z.number(),
  name: z.string().max(50),
  email: z.string().email().max(50),
  abilities: z.string().max(500),
  position: z.enum([
    "Desenvolvedor Front End",
    "Desenvolvedor Back End",
    "Desenvolvedor Full Stack",
    "UX Designer"
  ]),
  aboutMe: z.string().max(2500),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Validation for 'GET candidates/:id' endpoint
export const GetCandidateSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
