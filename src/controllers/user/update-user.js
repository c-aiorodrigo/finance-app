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
import { EmailAlreadyInUse } from '../../error/user.js'

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

            const validadeFields = await updateUserSchema.parseAsync(params)

            const paramsToUpdate = {
                ...(validadeFields.first_name && {
                    firstName: validadeFields.first_name,
                }),
                ...(validadeFields.last_name && {
                    lastName: validadeFields.last_name,
                }),
                ...(validadeFields.email && { email: validadeFields.email }),
                ...(validadeFields.password && {
                    password: validadeFields.password,
                }),
            }

            const updateUser = await this.updateUserUseCase.execute(
                userId,
                paramsToUpdate,
            )

            return ok(updateUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof EmailAlreadyInUse) {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return internalServerError()
        }
    }
}
