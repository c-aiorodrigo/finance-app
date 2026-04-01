import {
    ok,
    bodyIsEmptyResponse,
    checkIfIdIsValid,
    checkIfSomeFieldIsBlanck,
    checkIfSomeFieldIsNotAllowed,
    checkIfTheBodyIsEmpty,
    checkIfTransactionIdIsValid,
    internalServerError,
    invalidIdResponse,
    invalidTransactionIdResponse,
    someFieldIsBlankResponse,
} from '../helpers/index.js'

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

            const allowedFields = ['name', 'date', 'amount', 'type']

            const someFieldIsNotAllowed = checkIfSomeFieldIsNotAllowed(
                updateTransactionParams,
                allowedFields,
            )
            if (someFieldIsNotAllowed) {
                return checkIfSomeFieldIsNotAllowed()
            }

            const someFieldIsBlank = checkIfSomeFieldIsBlanck(
                updateTransactionParams,
            )
            if (someFieldIsBlank) {
                return someFieldIsBlankResponse()
            }
            const updateParams = { ...updateTransactionParams, userId }
            const updatedTransaction =
                await this.updateTransactionUseCase.execute(updateParams)

            return ok(updatedTransaction)
        } catch (error) {
            console.error(error)
            return internalServerError()
        }
    }
}
