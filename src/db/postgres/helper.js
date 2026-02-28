import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
})

export const PostgresHelper = {
    query: async (query, params) => {
        const client = await pool.connect()
        const results = await client.query(query, params)

        await client.release()

        return results.rows
    },
}
