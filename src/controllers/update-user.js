import { UpdateUserUseCase } from '../use-cases/index.js'
import {
    badRequest,
    internalServerError,
    ok,
    checkIfEmailIsValid,
    checkIfIdIsValid,
    checkIfPasswordIsValid,
    invalidEmailResponse,
    invalidIdResponse,
    invalidPasswordResponse,
} from './helpers/index.js'

export class UpdateUserController {
    async execute(httpReq) {
        try {
            const userId = httpReq.params.id

            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) {
                return invalidIdResponse
            }

            const params = httpReq.body

            const isBodyEmpty = Object.keys(params).length === 0

            if (isBodyEmpty) {
                return badRequest({
                    message: 'All fields are empty!',
                })
            }

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowes = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowes) {
                return badRequest({
                    message: 'Some field provide is not allowed',
                })
            }

            const someFieldIsBlank = Object.keys(params).some(
                (field) =>
                    typeof params[field] === 'string' &&
                    params[field].trim().length === 0,
            )

            if (someFieldIsBlank) {
                return badRequest({ message: 'Some provided field is blank' })
            }

            if (params.password) {
                if (!checkIfPasswordIsValid(params.password)) {
                    return invalidPasswordResponse
                }
            }

            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email)
                if (!emailIsValid) {
                    return invalidEmailResponse
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()

            const updateUser = await updateUserUseCase.execute(userId, params)

            return ok(updateUser)
        } catch (error) {
            console.error(error)
            return internalServerError()
        }
    }
}
