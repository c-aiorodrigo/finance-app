import {
    internalServerError,
    ok,
    checkIfEmailIsValid,
    checkIfIdIsValid,
    checkIfPasswordIsValid,
    invalidEmailResponse,
    invalidIdResponse,
    invalidPasswordResponse,
    bodyIsEmptyResponse,
    checkIfTheBodyIsEmpty,
    checkIfSomeFieldIsNotAllowed,
    someFieldIsNotAllowedResponse,
    checkIfSomeFieldIsBlanck,
    someFieldIsBlankResponse,
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

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowed = checkIfSomeFieldIsNotAllowed(
                params,
                allowedFields,
            )

            if (someFieldIsNotAllowed) {
                return someFieldIsNotAllowedResponse()
            }

            const someFieldIsBlank = checkIfSomeFieldIsBlanck(params)
            if (someFieldIsBlank) {
                return someFieldIsBlankResponse()
            }

            if (params.password) {
                if (!checkIfPasswordIsValid(params.password)) {
                    return invalidPasswordResponse()
                }
            }

            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email)
                if (!emailIsValid) {
                    return invalidEmailResponse()
                }
            }

            const updateUser = await this.updateUserUseCase.execute(
                userId,
                params,
            )

            return ok(updateUser)
        } catch (error) {
            console.error(error)
            return internalServerError()
        }
    }
}
