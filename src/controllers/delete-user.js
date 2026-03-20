import {
    checkIfIdIsValid,
    internalServerError,
    invalidIdResponse,
    notFound,
    ok,
} from './helpers/index.js'

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }
    async execute(httpReq) {
        try {
            const userId = httpReq.params.userId

            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse
            }

            const deletedUser = await this.deleteUserUseCase.execute(userId)

            if (!deletedUser) {
                return notFound({ message: 'User not found' })
            }

            return ok(deletedUser)
        } catch (error) {
            console.error(error)
            return internalServerError()
        }
    }
}
