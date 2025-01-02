import {z} from 'zod'


export const forgotPasswordScehma = z.object({
    email: z.string()
})

export type forgotPasswordScehmaInterface = z.infer<typeof forgotPasswordScehma >


