import { prisma } from '../../../../prisma/prisma.js'

export class PostgresUpdateTransactionRepository {
    async execute(id, updateTransactionParams) {
        const updateTransaction = await prisma.transaction.update({
            where: { id: id },
            data: updateTransactionParams,
        })
        return updateTransaction
    }
}
