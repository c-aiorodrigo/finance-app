import {
    CreateUserController,
    UpdateUserController,
} from '../../controllers/index.js'
import {
    PostgresCreateUserRepository,
    PostgresGetUserByEmailRepository,
    PostgresUpdateUserRepository,
} from '../../repositories/postgres/index,js'
import { CreateUserUseCase, UpdateUserUseCase } from '../../use-cases/index.js'

//POST//
export const makeCreateUserController = () => {
    const getUserByEmail = new PostgresGetUserByEmailRepository()
    const createUserRepository = new PostgresCreateUserRepository()
    const createUserUseCase = new CreateUserUseCase(
        getUserByEmail,
        createUserRepository,
    )
    const createUserController = new CreateUserController(createUserUseCase)

    return createUserController
}

//PATCH//
export const makeUpdateUserController = () => {
    const getUserByEmail = new PostgresGetUserByEmailRepository()
    const updateUserRepository = new PostgresUpdateUserRepository()
    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmail,
        updateUserRepository,
    )
    const updateUserController = new UpdateUserController(updateUserUseCase)

    return updateUserController
}
