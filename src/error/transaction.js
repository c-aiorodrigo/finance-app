export class TransactionNotFoundError extends Error {
    constructor(id) {
        super(`User id ${id} not found!`)

        this.name = 'TransactionNotFoundError'
    }
}
