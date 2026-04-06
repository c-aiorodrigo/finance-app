import {
    TransactionNotFoundError,
    UserNotFoundError,
} from '../../error/index.js'

export class UpdateTransactionUseCase {
    constructor(
        getUserByIdRepository,
        getTransactionByIdRepository,
        updateTransactionRepository,
    ) {
        this.getTransactionByIdRepository = getTransactionByIdRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.updateTransactionRepository = updateTransactionRepository
    }

    async execute(params) {
        //Verificar se o User Id existe
        const userId = params.userId
        const user = await this.getUserByIdRepository.execute(params.userId)
        if (!user) {
            throw new UserNotFoundError(userId)
        }

        //Verificar se o id da transação existe
        const id = params.id
        const transactionId =
            await this.getTransactionByIdRepository.execute(id)

        if (!transactionId) {
            throw new TransactionNotFoundError()
        }

        if (transactionId.user_id !== params.userId) {
            throw new Error('User not authorized to update this transaction.')
        }

        const transactionToUpdate = { ...params }
        delete transactionToUpdate.id
        delete transactionToUpdate.userId

        const updatedTransactionsParams =
            await this.updateTransactionRepository.execute(
                id,
                transactionToUpdate,
            )
        return updatedTransactionsParams
    }
}
