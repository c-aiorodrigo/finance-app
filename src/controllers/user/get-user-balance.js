import { UserNotFoundError } from '../../error/user.js'
import {
    checkIfIdIsValid,
    internalServerError,
    invalidIdResponse,
    ok,
    requiredFieldsIsMissingResponse,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }

    async execute(httpReq) {
        try {
            const userId = httpReq.params.userId

            if (!userId) {
                return requiredFieldsIsMissingResponse('userId')
            }

            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) {
                return invalidIdResponse()
            }

            const userBalance = await this.getUserBalanceUseCase.execute(userId)

            if (!userBalance) {
                return userNotFoundResponse()
            }
            return ok(userBalance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            console.error(error)
            return internalServerError()
        }
    }
}
