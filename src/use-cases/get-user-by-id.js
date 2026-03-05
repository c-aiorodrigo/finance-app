import { PostgresGetUserByIdRepository } from '../repositories/postgres/get-user-by-id.js'

export class GetUserByIdUseCase {
    async execute(userId) {
        const postgresGetUserByIdRepository =
            new PostgresGetUserByIdRepository()
        const user = postgresGetUserByIdRepository.execute(userId)

        if (!user) {
            return null
        }

        delete user.password

        return user
    }
}
