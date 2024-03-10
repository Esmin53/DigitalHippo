import { z } from "zod"

export const AuthCredentialsValidator = z.object({
    email: z.string(),
    password: z.string().min(8, { 
        message: "You'r password must be at least 8 characters long!"
    })
})

export type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>