import {
    checkIfIdIsValid,
    internalServerError,
    invalidIdResponse,
    ok,
    requiredFieldsIsMissingResponse,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetTransactionByUserIdController {
    constructor(getTransactionByUserIdUserCase) {
        this.getTransactionByUserIdUserCase = getTransactionByUserIdUserCase
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
                await this.getTransactionByUserIdUserCase.execute(userId)

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
