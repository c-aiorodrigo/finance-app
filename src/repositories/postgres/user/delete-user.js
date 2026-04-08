import { prisma } from '../../../../prisma/prisma.js'

export class PostgresDeleteUserRepository {
    async execute(userId) {
        const deletedUser = await prisma.user.delete({
            where: { id: userId },
        })
        return deletedUser
    }
}
