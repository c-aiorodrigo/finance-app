import {
    TransactionNotFoundError,
    UserNotFoundError,
} from '../../error/index.js'

export class DeleteTransactionUseCase {
    constructor(
        getTransactionByIdRepository,
        getUserByIdRepository,
        deleteTransactionRepository,
    ) {
        this.getTransactionByIdRepository = getTransactionByIdRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.deleteTransactionRepository = deleteTransactionRepository
    }

    async execute(transactionId, userId) {
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)
        if (!transaction) {
            throw new TransactionNotFoundError()
        }

        if (transaction.userId !== userId) {
            throw new Error('User not authorized to update this transaction.')
        }

        const deletedTransaction =
            await this.deleteTransactionRepository.execute(transactionId)

        if (!deletedTransaction) {
            return null
        }

        return deletedTransaction
    }
}
