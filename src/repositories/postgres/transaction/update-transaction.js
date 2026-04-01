import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresUpdateTransactionRepository {
    async execute(id, updateTransactionParams, userId) {
        const updateFields = []
        const updateValues = []

        Object.keys(updateTransactionParams).forEach((key) => {
            updateFields.push(`"${key}"= $${updateValues.length + 1}`)
            updateValues.push(updateTransactionParams[key])
        })

        updateValues.push(id)
        const transationsId = updateValues.length

        // 3. Adiciona o ID do usuário na lista de valores
        updateValues.push(userId)
        const idUser = updateValues.length

        const updateQuery = `
        UPDATE transations
        SET ${updateFields.join(', ')}
        WHERE id = $${transationsId} AND user_id = $${idUser}
        RETURNING *
        `

        const updateTransaction = await PostgresHelper.query.apply(
            updateQuery,
            updateValues,
        )

        return updateTransaction[0]
    }
}
