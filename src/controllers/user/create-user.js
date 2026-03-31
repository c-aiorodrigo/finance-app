import {
    badRequest,
    created,
    internalServerError,
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    invalidEmailResponse,
    invalidPasswordResponse,
    validateRequiredFields,
} from '../helpers/index.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpReq) {
        try {
            const params = httpReq.body
            //validar campos obrigatórios, email e tamanho de senha
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]
            //Validação de campos obrigatorios
            const requiredFieldsValidation = validateRequiredFields(
                params,
                requiredFields,
            )
            if (!requiredFieldsValidation.ok) {
                return badRequest({
                    message: `The field ${requiredFieldsValidation.missing} can not be empty`,
                })
            }
            if (!checkIfPasswordIsValid(params.password)) {
                return invalidPasswordResponse()
            }

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
