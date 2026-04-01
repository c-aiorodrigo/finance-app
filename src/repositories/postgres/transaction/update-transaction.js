import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresUpdateTransactionRepository {
    async execute(id, updateTransactionParams) {
        const updateFields = []
        const updateValues = []

        Object.keys(updateTransactionParams).forEach((key) => {
            updateFields.push(`"${key}"= $${updateValues.length + 1}`)
            updateValues.push(updateTransactionParams[key])
        })

        updateValues.push(id)
        const transactionId = updateValues.length

        const updateQuery = `
        UPDATE transactions
        SET ${updateFields.join(', ')}
        WHERE id = $${transactionId}
        RETURNING *
        `
        console.log('=== DEBUG DO REPOSITORY ===')
        console.log('SQL Montado:', updateQuery)
        console.log('Valores do Array:', updateValues)
        const updateTransaction = await PostgresHelper.query(
            updateQuery,
            updateValues,
        )

        return updateTransaction[0]
    }
}
