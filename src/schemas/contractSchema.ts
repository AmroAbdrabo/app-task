// src/schema.ts
import { z } from 'zod';

export const contractSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cost: z.coerce.number().min(0, "Cost must be positive."),
  duration: z.coerce.number().min(1, "Duration must be at least 1 month"),
  cycle: z.coerce.number().min(1, "Cycle must be at least 1 month")
});
