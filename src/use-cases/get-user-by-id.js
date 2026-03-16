import { PostgresGetUserByIdRepository } from '../repositories/postgres/index.js'

export class GetUserByIdUseCase {
    async execute(userId) {
        const postgresGetUserByIdRepository =
            new PostgresGetUserByIdRepository()
        const user = await postgresGetUserByIdRepository.execute(userId)

        if (!user) {
            return null
        }
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPassword } = user

        return userWithoutPassword
    }
}
