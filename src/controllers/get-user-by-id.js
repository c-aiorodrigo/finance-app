import { GetUserByIdUseCase } from '../use-cases/index.js'
import {
    internalServerError,
    notFound,
    ok,
    checkIfIdIsValid,
    invalidIdResponse,
} from './helpers/index.js'

export class GetUserByIdController {
    async execute(httpReq) {
        try {
            const userId = httpReq.params.id

            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) {
                return invalidIdResponse
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
