import { createTransactionSchema } from '../../../schemas/index.js'
import { internalServerError, created, badRequest } from '../helpers/index.js'
import { ZodError } from 'zod'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpReq) {
        try {
            const params = httpReq.body

            const validateFields = createTransactionSchema.parse(params)

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
