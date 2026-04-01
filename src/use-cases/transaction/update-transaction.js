import {
    checkIfAmountIsValid,
    checkIfTypeIsValid,
} from '../../controllers/helpers/index.js'
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

    async execute(updateTransactionParams) {
        //Verificar se o User Id existe
        const userId = updateTransactionParams.userId
        const user = await this.getUserByIdRepository.execute(
            updateTransactionParams.userId,
        )
        if (!user) {
            throw new UserNotFoundError(userId)
        }

        //Verificar se o id da transação existe
        const id = updateTransactionParams.id
        const transactionId =
            await this.getTransactionByIdRepository.execute(id)

        if (!transactionId) {
            throw new TransactionNotFoundError()
        }

        if (transactionId.user_id !== updateTransactionParams.userId) {
            throw new Error('User not authorized to update this transaction.')
        }

        //Se for o 'tipo de transação' verificar se está dentro dos padrões
        if (updateTransactionParams.type) {
            const isThisTypeValid = checkIfTypeIsValid(
                updateTransactionParams.type,
            )

            if (!isThisTypeValid) {
                throw new Error('The type is not valid')
            }

            updateTransactionParams.type = updateTransactionParams.type
                .trim()
                .toUpperCase()
        }

        //Se for montante, verificar se é valido

        if (updateTransactionParams.amount) {
            const isThisAmountValid = checkIfAmountIsValid(
                updateTransactionParams.amount,
            )
            if (!isThisAmountValid) {
                throw new Error('The amount is not valid!')
            }
        }

        delete updateTransactionParams.id
        delete updateTransactionParams.userId

        const updatedTransactionsParams =
            await this.updateTransactionRepository.execute(
                id,
                updateTransactionParams,
            )
        return updatedTransactionsParams
    }
}
