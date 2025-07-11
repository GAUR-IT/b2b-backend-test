import { z } from "zod";

export const PostTerm = z.object({
  term: z.string(),
});

