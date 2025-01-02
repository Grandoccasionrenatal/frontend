import {z} from 'zod'

export const resetPasswordBaseScehma = z.object({
    password: z.string().trim().min(1, {message: 'Please enter a password'}),
    passwordConfirmation: z.string().trim().min(1,{message: 'Please enter a password'})
})


export const resetPasswordScehma = resetPasswordBaseScehma.superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        path: [...ctx.path, "confirm_password"],
        code: "custom",
        message: "Must match password!",
      });
    }
  });

  export const resetPasswordApiScehma = resetPasswordBaseScehma.extend({
    code: z.string()
  })


export type ResetPasswordScehmaInterface = z.infer<typeof resetPasswordScehma>
export type resetPasswordApiScehmaInterface = z.infer<typeof resetPasswordApiScehma>