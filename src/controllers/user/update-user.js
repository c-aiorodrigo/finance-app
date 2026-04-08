import { ZodError } from 'zod'
import { updateUserSchema } from '../../../schemas/users.js'
import {
    internalServerError,
    ok,
    checkIfIdIsValid,
    invalidIdResponse,
    bodyIsEmptyResponse,
    checkIfTheBodyIsEmpty,
    badRequest,
} from '../helpers/index.js'

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }
    async execute(httpReq) {
        try {
            const userId = httpReq.params.id

            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) {
                return invalidIdResponse()
            }

            const params = httpReq.body

            const isBodyEmpty = checkIfTheBodyIsEmpty(params)

            if (isBodyEmpty) {
                return bodyIsEmptyResponse()
            }

            const paramsToUpdate = {
                ...(params.first_name && { firstName: params.first_name }),
                ...(params.last_name && { lastName: params.last_name }),
                ...(params.email && { email: params.email }),
                ...(params.password && { password: params.password }),
            }
            const validadeFields =
                await updateUserSchema.parseAsync(paramsToUpdate)

            const updateUser = await this.updateUserUseCase.execute(
                userId,
                validadeFields,
            )

            return ok(updateUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            console.error(error)
            return internalServerError()
        }
    }
}
