import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresTransactionByIdRepository {
    async execute(id) {
        //recebendo os paremetros do usuario
        const transaction = await PostgresHelper.query(
            'SELECT * FROM transactions WHERE id = $1',
            [id],
        )

        return transaction[0]
    }
}
