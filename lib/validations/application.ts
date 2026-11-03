
import { z } from "zod";

export const applicationSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(100),
  jobTitle: z.string().trim().min(1, "Job title is required").max(100),

  status: z.enum([
    "Wishlist",
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
    "Withdrawn",
  ]),

  location: z.string().trim().max(100).optional(),
  jobUrl: z.string().trim().max(500).optional(),
  appliedAt: z
    .string()
    .refine(
      (value) => !value || !Number.isNaN(Date.parse(value)),
      "Invalid application date"
    )
    .optional(),
  notes: z.string().trim().max(5000).optional(),
});
