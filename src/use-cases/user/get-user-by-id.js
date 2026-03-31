import { UserNotFoundError } from '../../error/user.js'

export class GetUserByIdUseCase {
    constructor(getUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(userId) {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPassword } = user

        return userWithoutPassword
    }
}
