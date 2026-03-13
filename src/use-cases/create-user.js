import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import {
    PostgresCreateUserRepository,
    PostgresGetUserByEmailRepository,
} from '../repositories/postgres/index.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        const getUserByEmail = new PostgresGetUserByEmailRepository()

        const emailAlreadyExist = await getUserByEmail.execute(
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

        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        return await postgresCreateUserRepository.execute(user)
    }
}
