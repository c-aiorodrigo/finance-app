import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresGetUserByEmailRepository {
    async execute(userEmail) {
        //recebendo os paremetros do usuario
        const user = await PostgresHelper.query(
            'SELECT * FROM users WHERE email = $1',
            [userEmail],
        )

        return user[0]
    }
}
