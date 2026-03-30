export class EmailAlreadyInUse extends Error {
    constructor(email) {
        super(`Email ${email} is already in use!`)
        this.name = 'EmailAlreadyInUse'
    }
}

export class UserNotFoundError extends Error {
    constructor(userId) {
        super(`User id ${userId} not found!`)

        this.name = 'UserNotFoundError'
    }
}
