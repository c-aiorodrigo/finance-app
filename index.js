import 'dotenv/config'
import express from 'express'
import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
} from './src/controllers/index.js'
import {
    PostgresGetUserByIdRepository,
    PostgresCreateUserRepository,
    PostgresUpdateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserByEmailRepository,
} from './src/repositories/postgres/index.js'
import {
    GetUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
} from './src/use-cases/index.js'

const app = express()
app.use(express.json())

//GET//
const getUserByIdRepository = new PostgresGetUserByIdRepository()
const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

app.get('/api/users/:id', async (request, response) => {
    const getUserByIdResponse = await getUserByIdController.execute(request)

    response
        .status(getUserByIdResponse.statusCode)
        .json(getUserByIdResponse.body)
})

//POST//
const getUserByEmail = new PostgresGetUserByEmailRepository()
const createUserRepository = new PostgresCreateUserRepository()
const createUserUseCase = new CreateUserUseCase(
    getUserByEmail,
    createUserRepository,
)
const createUserController = new CreateUserController(createUserUseCase)

app.post('/api/users', async (request, response) => {
    const createUserResponse = await createUserController.execute(request)

    //createUserResponse = {statusCode, body}
    response.status(createUserResponse.statusCode).json(createUserResponse.body)
})

//PATCH//
const updateUserRepository = new PostgresUpdateUserRepository()
const updateUserUseCase = new UpdateUserUseCase(
    getUserByEmail,
    updateUserRepository,
)
const updateUserController = new UpdateUserController(updateUserUseCase)

app.patch('/api/users/:id', async (request, response) => {
    const updateUserResponse = await updateUserController.execute(request)

    response.status(updateUserResponse.statusCode).json(updateUserResponse.body)
})

//DELETE//
const deleteUserRepository = new PostgresDeleteUserRepository()
const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
const deleteUserController = new DeleteUserController(deleteUserUseCase)

app.delete('/api/users/:id', async (request, response) => {
    const deleteUserResponse = await deleteUserController.execute(request)

    response.status(deleteUserResponse.statusCode).json(deleteUserResponse.body)
})

app.listen(process.env.PORT_API, () => {
    console.log('Abrindo o predio 8080!')
})
