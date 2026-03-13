import { CreateUserUseCase } from '../use-cases/create-user.js'
import { badRequest, created, internalServerError } from './helpers/http.js'
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    invalidEmailResponse,
    invalidPasswordResponse,
} from './helpers/user.js'

export class CreateUserController {
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

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({
                        message: 'The fields can not be empty!',
                    })
                }

                if (!checkIfPasswordIsValid(params.password)) {
                    return invalidPasswordResponse
                }

                const emailIsValid = checkIfEmailIsValid(params.email)
                if (!emailIsValid) {
                    return invalidEmailResponse
                }

                //Chamando Use Case
                const createUserCase = new CreateUserUseCase()
                const createdUser = await createUserCase.execute(params)
                return created(createdUser)
            }
            //Retornando resposta para o usúario
        } catch (error) {
            console.error(error)
            return internalServerError
        }
    }
}
