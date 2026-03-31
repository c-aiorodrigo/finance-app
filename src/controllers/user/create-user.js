import {
    created,
    internalServerError,
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    invalidEmailResponse,
    invalidPasswordResponse,
    validateRequiredFields,
    requiredFieldsIsMissingResponse,
} from '../helpers/index.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpReq) {
        try {
            const params = httpReq.body
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            //Validação de campos obrigatorios
            const { ok: requiredFieldsIsOk, missing: missingFields } =
                validateRequiredFields(params, requiredFields)
            if (!requiredFieldsIsOk) {
                return requiredFieldsIsMissingResponse(missingFields)
            }

            //Validação de Senha
            if (!checkIfPasswordIsValid(params.password)) {
                return invalidPasswordResponse()
            }

            //Validação de Email
            const emailIsValid = checkIfEmailIsValid(params.email)
            if (!emailIsValid) {
                return invalidEmailResponse()
            }

            //Chamando Use Case
            const createdUser = await this.createUserUseCase.execute(params)
            return created(createdUser)
        } catch (error) {
            //Retornando resposta para o usúario
            console.error(error)
            return internalServerError()
        }
    }
}
