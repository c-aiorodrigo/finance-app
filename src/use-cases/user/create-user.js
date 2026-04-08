import bcrypt from 'bcrypt'
import { EmailAlreadyInUse } from '../../error/user.js'
export class CreateUserUseCase {
    constructor(getUserByEmailRepository, createUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.createUserRepository = createUserRepository
    }
    async execute(createUserParams) {
        const emailAlreadyExist = await this.getUserByEmailRepository.execute(
            createUserParams.email,
        )

        if (emailAlreadyExist) {
            throw new EmailAlreadyInUse(createUserParams.email)
        }

        //criptografar senha
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

        //inserir o usuário no banco de dados
        const user = {
            password: hashedPassword,
            firstName: createUserParams.firstName,
            lastName: createUserParams.lastName,
            email: createUserParams.email,
        }

        //chamar o repositorio
        const createdUser = await this.createUserRepository.execute(user)
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPassword } = createdUser

        return userWithoutPassword
    }
}
