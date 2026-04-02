import {
    checkIfIdIsValid,
    checkIfTransactionIdIsValid,
    internalServerError,
    invalidIdResponse,
    invalidTransactionIdResponse,
    notFound,
    ok,
} from '../helpers/index.js'

export class DeleteTranscactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
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

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(id, userId)

            if (!deletedTransaction) {
                return notFound({ message: 'Transction not found' })
            }

            return ok(deletedTransaction)
        } catch (error) {
            console.error(error)
            return internalServerError()
        }
    }
}
