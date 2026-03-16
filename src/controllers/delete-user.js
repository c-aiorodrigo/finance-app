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

            const deleteUserController = new DeleteUserController()
            const deletedUser = await deleteUserController.execute(userId)

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
