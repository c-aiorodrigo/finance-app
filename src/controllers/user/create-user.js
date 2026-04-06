import { badRequest, created, internalServerError } from '../helpers/index.js'
import { ZodError } from 'zod'
import { createUserSchema } from '../../../schemas/index.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpReq) {
        try {
            const params = httpReq.body

            const validatedParams = await createUserSchema.parseAsync(params)

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
            console.error(error)
            return internalServerError()
        }
    }
}
