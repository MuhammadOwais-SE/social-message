import {z} from "zod";

export const msgSchema = z.object({
    content: z.string()
    .min(10, {message: "Content must have atleast 10 character"})
    .max(300,"Content must not exceed 300 characters")
})