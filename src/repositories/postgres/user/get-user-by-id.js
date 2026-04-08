import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserByIdRepository {
    async execute(userId) {
        //recebendo os paremetros do usuario
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        return user
    }
}
