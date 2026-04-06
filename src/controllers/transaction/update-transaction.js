import { updateTransactionSchema } from '../../../schemas/index.js'
import {
    ok,
    bodyIsEmptyResponse,
    checkIfIdIsValid,
    checkIfTheBodyIsEmpty,
    checkIfTransactionIdIsValid,
    internalServerError,
    invalidIdResponse,
    invalidTransactionIdResponse,
    badRequest,
} from '../helpers/index.js'
import { ZodError } from 'zod'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }

    async execute(httpReq) {
        try {
            const id = httpReq.params.id
            const userId = httpReq.query.userId

            const isUserIdValid = checkIfIdIsValid(userId)
            if (!isUserIdValid) {
                return invalidIdResponse()
            }

            const isTranscationIdValid = checkIfTransactionIdIsValid(id)
            if (!isTranscationIdValid) {
                return invalidTransactionIdResponse()
            }

            const updateTransactionParams = httpReq.body

            const isBodyEmpty = checkIfTheBodyIsEmpty(updateTransactionParams)
            if (isBodyEmpty) {
                return bodyIsEmptyResponse()
            }

            const validateUpdateTransactionParams =
                await updateTransactionSchema.parseAsync(
                    updateTransactionParams,
                )
            const updateParams = {
                ...validateUpdateTransactionParams.data,
                userId,
                id,
            }

            const updatedTransaction =
                await this.updateTransactionUseCase.execute(updateParams)

            return ok(updatedTransaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.issues[0].message })
            }
            console.error(error)
            return internalServerError()
        }
    }
}
