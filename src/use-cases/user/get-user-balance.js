import { UserNotFoundError } from '../../error/index.js'

export class GetUserBalanceUseCase {
    constructor(getUserByIdRepository, getUserBalanceRepository) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getUserBalanceRepository = getUserBalanceRepository
    }

    async execute(userId) {
        const user = await this.getUserbyIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactions = await this.getUserBalanceRepository.execute(userId)

        return transactions
    }
}
