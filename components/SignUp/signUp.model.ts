import {z} from 'zod'


export const signUpSchema = z.object({
    username: z.string().min(1, {message: 'Please enter a valid username'}),
    first_name: z.string().min(1, {message: 'Please enter your first name'}),
    last_name: z.string().min(1, {message: 'Please enter your last name'}),
    email: z.string().email({message: 'Please enter a valid email'}),
    password: z.string().min(6, {message: 'Please enter a minimum of 6 characters'})
})


export type signUpInterface = z.infer<typeof signUpSchema>