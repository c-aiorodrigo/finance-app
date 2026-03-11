import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { badRequest, internalServerError, ok } from './helpers.js'
import validator from 'validator'

export class UpdateUserController {
    async execute(httpReq) {
        try {
            const userId = httpReq.params.id

            const isIdValid = validator.isUUID(userId)
            if (!isIdValid) {
                return badRequest({ message: 'The Id is not valid' })
            }

            const updateParams = httpReq.body

            const isBodyEmpty = Object.keys(updateParams).length === 0

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

            const someFieldIsNotAllowes = Object.keys(updateParams).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowes) {
                return badRequest({
                    message: 'Some field provide is not allowed',
                })
            }

            const someFieldIsBlank = Object.keys(updateParams).some(
                (field) =>
                    typeof updateParams[field] === 'string' &&
                    updateParams[field].trim().length === 0,
            )

            if (someFieldIsBlank) {
                return badRequest({ message: 'Some provided field is blank' })
            }

            if (updateParams.password && updateParams.password.length < 6) {
                return badRequest({
                    message: 'Password must be a least 6 characters.',
                })
            }

            if (updateParams.email) {
                const emailIsValid = validator.isEmail(updateParams.email)
                if (!emailIsValid) {
                    return badRequest({ message: 'Invalid Email' })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()

            const updateUser = await updateUserUseCase.execute(
                userId,
                updateParams,
            )

            return ok(updateUser)
        } catch (error) {
            console.error(error)
            return internalServerError()
        }
    }
}
