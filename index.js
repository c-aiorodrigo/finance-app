import 'dotenv/config'
import express from 'express'
import {
    DeleteUserController,
    GetUserByIdController,
} from './src/controllers/index.js'
import {
    PostgresGetUserByIdRepository,
    PostgresDeleteUserRepository,
} from './src/repositories/postgres/index.js'
import { GetUserByIdUseCase, DeleteUserUseCase } from './src/use-cases/index.js'
import {
    makeGetUserByIdController,
    makeUpdateUserController,
} from './src/factories/controllers/user.js'

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

app.post('/api/users', async (request, response) => {
    const createUserController = makeGetUserByIdController()
    const createUserResponse = await createUserController.execute(request)

    //createUserResponse = {statusCode, body}
    response.status(createUserResponse.statusCode).json(createUserResponse.body)
})

app.patch('/api/users/:id', async (request, response) => {
    const updateUserController = makeUpdateUserController()
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
