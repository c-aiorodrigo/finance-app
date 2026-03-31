import { UserNotFoundError } from '../../error/user.js'

export class GetTransarionByUserIdUseCase {
    constructor(getTransactionByUserIdUseCase, getUserById) {
        this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
        this.getUserById = getUserById
    }

    //valindando existencia do user id
    async execute(params) {
        const user = await this.getUserById.execute(params.userId)

        if (!user) {
            throw new UserNotFoundError(params.userId)
        }

        const transaction = await this.getTransactionByUserIdUseCase.execute(
            params.userId,
        )
        return transaction
    }
}
