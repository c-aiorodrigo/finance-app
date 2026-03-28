import {
    internalServerError,
    notFound,
    ok,
    checkIfIdIsValid,
    invalidIdResponse,
} from '../helpers/index.js'

export class GetUserByIdController {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase
    }
    async execute(httpReq) {
        try {
            const userId = httpReq.params.id

            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) {
                return invalidIdResponse()
            }

            const user = await this.getUserByIdUseCase.execute(userId)

            if (!user) {
                return notFound({ message: 'User not found' })
            }

            return ok(user)
        } catch (error) {
            console.error(error)
            return internalServerError()
        }
    }
}
