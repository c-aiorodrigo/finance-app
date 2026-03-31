import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresGetTransactionsByUserIdRepository {
    async execute(userId) {
        const transactions = await PostgresHelper.query(
            'SELECT * FROM transations WHERE user_id = $1',
            [userId],
        )

        return transactions
    }
}
