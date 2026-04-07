import { prisma } from '../../../../prisma/prisma.js'

export class PostgresTransactionByIdRepository {
    async execute(id) {
        //recebendo os paremetros do usuario
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: id,
            },
        })

        return transaction
    }
}
