import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
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
            throw new Error('The email already exists')
        }

        //gerar ID
        const userId = uuidv4()

        //criptografar senha
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

        //inserir o usuário no banco de dados
        const user = {
            id: userId,
            password: hashedPassword,
            first_name: createUserParams.first_name,
            last_name: createUserParams.last_name,
            email: createUserParams.email,
        }

        //chamar o repositorio
        const createdUser = await this.createUserRepository.execute(user)
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPassword } = createdUser

        return userWithoutPassword
    }
}
