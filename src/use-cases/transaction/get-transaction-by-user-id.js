import { UserNotFoundError } from '../../error/user.js'

export class GetTransactionsByUserIdUseCase {
    constructor(getTransactionsByUserIdUseCase, getUserById) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
        this.getUserById = getUserById
    }

    //valindando existencia do user id
    async execute(params) {
        const user = await this.getUserById.execute(params.userId)

        if (!user) {
            throw new UserNotFoundError(params.userId)
        }

        const transactions = await this.getTransactionsByUserIdUseCase.execute(
            params.userId,
        )
        return transactions
    }
}
