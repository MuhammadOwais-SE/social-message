import {z} from "zod";

export const usernameValid =  z
.string()
.min(2, "username must be atleast 2 or more character")
.max(20, "username must be no more than 20")
.regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
  "username must not contain any special character"  
)

export const emailValid = z
.string()
.email({message: "Invalid Email"})

export const signUpSchema = z.object({
    username: usernameValid,
    email: emailValid,
    password: z.string().min(6, "password must be atleast 6 characters"),

})