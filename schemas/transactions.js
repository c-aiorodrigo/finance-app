import { z } from 'zod'
import validator from 'validator'

export const createTransactionSchema = z.object({
    userId: z
        .string({ message: 'User ID is required' })
        .trim()
        .pipe(z.uuid({ message: 'User ID must be a valid UUID' })),

    name: z.string({ message: 'Name is required' }).trim().min(1, {
        message: 'Name is required',
    }),

    date: z.coerce.date({ message: 'Date is required' }),

    amount: z
        .number({ message: 'Amount is required' })
        .min(0.01, {
            message: 'Amount must be greater than 0',
        })
        .refine((value) =>
            validator.isCurrency(value.toString(), {
                digits_after_decimal: [1, 2],
                allow_decimal: true,
                decimal_separator: '.',
            }),
        ),

    type: z
        .string({ message: 'Type is required' })
        .trim()
        .toUpperCase()
        .pipe(
            z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
                message: 'Type must be EARNING, EXPENSE or INVESTMENT',
            }),
        ),
})

export const updateTransactionSchema = createTransactionSchema
    .partial()
    .strict()
