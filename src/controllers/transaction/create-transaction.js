import { createTransactionSchema } from '../../../schemas/index.js'
import { internalServerError, created, badRequest } from '../helpers/index.js'
import { ZodError } from 'zod'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpReq) {
        try {
            const { user_id, userId, name, date, amount, type } = httpReq.body

            const validateFields = createTransactionSchema.parse({
                userId: userId || user_id,
                name,
                date,
                amount,
                type,
            })

            const transaction =
                await this.createTransactionUseCase.execute(validateFields)

            return created(transaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            console.error(error)
            return internalServerError()
        }
    }
}
