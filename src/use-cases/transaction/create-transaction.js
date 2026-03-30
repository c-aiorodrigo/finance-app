import { UserNotFoundError } from '../../error/user.js'
import { v4 as uuidv4 } from 'uuid'

export class CreateTransactionUserCase {
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

        const transactionId = uuidv4()

        const transaction = {
            id: transactionId,
            ...createTransactionParams,
        }

        const createdTransaction =
            await this.createTransactionRepository.execute(transaction)

        return createdTransaction
    }
}
