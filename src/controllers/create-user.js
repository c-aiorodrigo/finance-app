import { CreateUserUseCase } from '../use-cases/create-user.js'
import validator from 'validator'
import { badRequest, created, internalServerError } from './helpers.js'

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

                if (params.password.length < 6) {
                    return badRequest({
                        message: 'Password must be a least 6 characters.',
                    })
                }

                const emailIsValid = validator.isEmail(params.email)
                if (!emailIsValid) {
                    return badRequest({ message: 'Invalid Email' })
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
