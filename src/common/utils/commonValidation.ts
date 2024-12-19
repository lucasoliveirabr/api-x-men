import { z } from "zod";

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num > 0, "ID must be a positive number"),
  name: z.string().max(50),
  email: z.string().email().max(50),
  abilities: z.string().max(500),
  position: z.enum(["Desenvolvedor Front End", "Desenvolvedor Back End", "Desenvolvedor Full Stack", "UX Designer"]),
  aboutMe: z.string().max(2500),
  createdAt: z.date(),
  updatedAt: z.date(),
};
