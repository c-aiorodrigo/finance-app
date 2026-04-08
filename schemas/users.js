import { z } from 'zod'

export const createUserSchema = z.object({
    firstName: z.string({ message: 'First name is required' }).trim().min(1, {
        message: 'First name is required',
    }),
    lastName: z.string({ message: 'Last name is required' }).trim().min(1, {
        message: 'Last name is required',
    }),
    email: z
        .string({ message: 'Email is required' })
        .trim()
        .pipe(
            z
                .email({ message: 'Please provide a valid email' })
                .min(1, { message: 'Email is required' }),
        ),
    password: z.string({ message: 'Password is required' }).trim().min(6, {
        message: 'A strong password must have at least 6 characters',
    }),
})

export const updateUserSchema = createUserSchema
    .partial()
    .strict({ message: 'Some fields are not allowed' })
