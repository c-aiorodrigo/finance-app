import { UserNotFoundError } from '../../error/user.js'

export class CreateTransactionUseCase {
    constructor(createTransactionRepository, getUserByIdRepository) {
        this.createTransactionRepository = createTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(createTransactionParams) {
        const userId = createTransactionParams.userId

        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transaction = {
            userId,
            ...createTransactionParams,
        }

        const createdTransaction =
            await this.createTransactionRepository.execute(transaction)

        return createdTransaction
    }
}
