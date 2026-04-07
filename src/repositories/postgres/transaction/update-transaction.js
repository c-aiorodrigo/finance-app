import { prisma } from '../../../../prisma/prisma.js'

export class PostgresUpdateTransactionRepository {
    async execute(id, updateTransactionParams) {
        const updateTransaction = await prisma.transaction.update({
            where: { id: id },
            data: {
                name: updateTransactionParams.name,
                date: updateTransactionParams.date,
                amount: updateTransactionParams.amount,
                type: updateTransactionParams.type,
            },
        })
        return updateTransaction
    }
}
