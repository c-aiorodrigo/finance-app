export class GetUserByIdUseCase {
    constructor(getUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(userId) {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            return null
        }
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPassword } = user

        return userWithoutPassword
    }
}
