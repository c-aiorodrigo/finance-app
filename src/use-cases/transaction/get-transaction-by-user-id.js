import { UserNotFoundError } from '../../error/user.js'

export class GetTransactionsByUserIdUseCase {
    constructor(getTransactionsByUserIdRepository, getUserById) {
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
        this.getUserById = getUserById
    }

    //valindando existencia do user id
    async execute(params) {
        const user = await this.getUserById.execute(params.userId)

        if (!user) {
            throw new UserNotFoundError(params.userId)
        }

        const transactions =
            await this.getTransactionsByUserIdRepository.execute(params.userId)
        return transactions
    }
}
