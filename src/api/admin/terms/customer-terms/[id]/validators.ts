import { z } from "zod";

// 1️⃣ Define schema to validate `terms_id` in additional_data
export const UpdateCustomerTermSchema = z.object({
  additional_data: z.object({
    terms_id: z.string().nullable(),
  }),
})
