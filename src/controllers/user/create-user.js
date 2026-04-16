import { badRequest, created, internalServerError } from '../helpers/index.js'
import { ZodError } from 'zod'
import { createUserSchema } from '../../../schemas/index.js'
import { EmailAlreadyInUse } from '../../error/index.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpReq) {
        try {
            const { first_name, last_name, email, password } = httpReq.body

            const validatedParams = await createUserSchema.parseAsync({
                first_name,
                last_name,
                email,
                password,
            })

            //Chamando Use Case
            const createdUser =
                await this.createUserUseCase.execute(validatedParams)
            return created(createdUser)
        } catch (error) {
            //Retornando resposta para o usúario

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof EmailAlreadyInUse) {
                return badRequest({
                    message: error.message,
                })
            }
            console.error(error)
            return internalServerError()
        }
    }
}
