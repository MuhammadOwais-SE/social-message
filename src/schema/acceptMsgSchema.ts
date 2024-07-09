import {z} from "zod";

export const acceptMsgSchema = z.object({
    acceptMsg : z.boolean()
})