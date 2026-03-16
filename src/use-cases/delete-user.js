import { PostgresDeleteUserRepository } from '../repositories/postgres/index.js'

export class DeleteUserUseCase {
    async execute(userId) {
        const postgresDeleteUserRepository = new PostgresDeleteUserRepository()
        const deletedUser = await postgresDeleteUserRepository.execute(userId)

        if (!deletedUser) {
            return null
        }

        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPassword } = deletedUser

        return userWithoutPassword
    }
}
