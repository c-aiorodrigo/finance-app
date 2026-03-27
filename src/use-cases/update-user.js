import bcrypt from 'bcrypt'

export class UpdateUserUseCase {
    constructor(getUserByEmailRepository, updateUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
    }
    async execute(userId, updateUserParams) {
        //1 - Se o email estiver sendo alterado, verificar se ele já está em uso:

        if (updateUserParams.email) {
            const emailAlreadyExist =
                await this.getUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (emailAlreadyExist && emailAlreadyExist.id !== userId) {
                throw new Error('The email already exists')
            }
        }

        const user = { ...updateUserParams }

        //2 - Se for a senha, criptografa-la antes de jogar no BD

        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            )

            user.password = hashedPassword
        }

        const updateUser = await this.updateUserRepository.execute(userId, user)
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPassword } = updateUser

        return userWithoutPassword
    }
}
