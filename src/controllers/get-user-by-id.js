import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { badRequest, internalServerError, notFound, ok } from './helpers.js'
import validator from 'validator'

export class GetUserByIdController {
    async execute(httpReq) {
        try {
            const userId = httpReq.params.id

            const isIdValid = validator.isUUID(userId)
            if (!isIdValid) {
                return badRequest({ message: 'The Id is not valid' })
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()
            const user = await getUserByIdUseCase.execute(userId)

            if (!user) {
                return notFound({ message: 'User not found' })
            }

            return ok(user)
        } catch (error) {
            console.error(error)
            return internalServerError
        }
    }
}
