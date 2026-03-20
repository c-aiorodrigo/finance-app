export class DeleteUserUseCase {
    constructor(deleteUserRepository) {
        this.deleteUserRepository = deleteUserRepository
    }
    async execute(userId) {
        const deletedUser = await this.deleteUserRepository.execute(userId)

        if (!deletedUser) {
            return null
        }

        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPassword } = deletedUser

        return userWithoutPassword
    }
}
