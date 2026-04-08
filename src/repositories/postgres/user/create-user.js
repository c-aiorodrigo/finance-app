import { prisma } from '../../../../prisma/prisma.js'

export class PostgresCreateUserRepository {
    async execute(createUserParams) {
        //criando os paremetros do usuario
        const results = await prisma.user.create({
            data: {
                firstName: createUserParams.firstName,
                lastName: createUserParams.lastName,
                email: createUserParams.email,
                password: createUserParams.password,
            },
        })

        return results
    }
}
