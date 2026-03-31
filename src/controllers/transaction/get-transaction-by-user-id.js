import {
    checkIfIdIsValid,
    internalServerError,
    invalidIdResponse,
    ok,
    requiredFieldsIsMissingResponse,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUserCase) {
        this.getTransactionsByUserIdUserCase = getTransactionsByUserIdUserCase
    }

    async execute(httpReq) {
        try {
            const userId = httpReq.query.userId

            if (!userId) {
                return requiredFieldsIsMissingResponse('userId')
            }

            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) {
                return invalidIdResponse()
            }

            const userTransactions =
                await this.getTransactionsByUserIdUserCase.execute({ userId })

            if (!userTransactions) {
                return userNotFoundResponse()
            }

            return ok(userTransactions)
        } catch (error) {
            console.error(error)
            return internalServerError()
        }
    }
}
