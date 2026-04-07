import { prisma } from '../../../../prisma/prisma.js'

export class PostgresCreateTransactionRepository {
    async execute(createTransactionParams) {
        const results = await prisma.transaction.create({
            data: {
                id: createTransactionParams.id,
                user_id: createTransactionParams.userId,
                name: createTransactionParams.name,
                date: createTransactionParams.date,
                amount: createTransactionParams.amount,
                type: createTransactionParams.type,
            },
        })

        return results
    }
}
