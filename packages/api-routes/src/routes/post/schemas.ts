import { z } from "zod";

export const postSchema = () => z.object({
    image: z.string(),
    text: z.string(),
    categories: z.array(z.string()),
})

export const postResponseSchema = () => z.object({
    status: z.string(),
    message: z.string(),
})

