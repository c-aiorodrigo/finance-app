import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        //TODO: verificar email

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
