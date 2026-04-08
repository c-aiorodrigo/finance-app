import { prisma } from '../../../../prisma/prisma.js'
export class PostgresGetUserByEmailRepository {
    async execute(userEmail) {
        //recebendo os paremetros do usuario
        const user = await prisma.user.findUnique({
            where: {
                email: userEmail,
            },
        })
        return user
    }
}
