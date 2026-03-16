import { DeleteUserUseCase } from '../use-cases/index.js'
import {
    checkIfIdIsValid,
    internalServerError,
    invalidIdResponse,
    notFound,
    ok,
} from './helpers/index.js'

export class DeleteUserController {
    async execute(httpReq) {
        try {
            const userId = httpReq.params.userId

            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse
            }

            const deleteUserUseCase = new DeleteUserUseCase()
            const deletedUser = await deleteUserUseCase.execute(userId)

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
