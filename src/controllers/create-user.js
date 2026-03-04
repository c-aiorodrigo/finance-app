import { CreateUserUseCase } from '../use-cases/create-user.js'

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
                    return {
                        statusCode: 400,
                        body: {
                            errorMessage: `Missing param: ${field}`,
                        },
                    }
                }
            }

            //Chamando Use Case
            const createUserCase = new CreateUserUseCase()
            const createdUser = await createUserCase.execute(params)
            return {
                statusCode: 201,
                body: createdUser,
            }

            //Retornando resposta para o usúario
        } catch (error) {
            console.error(error)
            return {
                statusCode: 500,
                body: {
                    errorMessage: 'Internal server error',
                },
            }
        }
    }
}
