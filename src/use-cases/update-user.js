import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user.js'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import bcrypt from 'bcrypt'

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        //1 - Se o email estiver sendo alterado, verificar se ele já está em uso:

        if (updateUserParams.email) {
            const getUserByEmail = new PostgresGetUserByEmailRepository()

            const emailAlreadyExist = await getUserByEmail.execute(
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

        const postgresUpdateUserUseCase = new PostgresUpdateUserRepository()
        const updateUser = await postgresUpdateUserUseCase.execute(userId, user)
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPassword } = updateUser

        return userWithoutPassword
    }
}
