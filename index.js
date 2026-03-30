import 'dotenv/config'
import express from 'express'
import {
    makeDeleteController,
    makeGetUserByIdController,
    makeUpdateUserController,
    makeCreateUserController,
} from './src/factories/controllers/user.js'
import { makeCreateTransactionController } from './src/factories/controllers/transaction.js'

const app = express()
app.use(express.json())

//USER ROUTES//
const getUserByIdController = makeGetUserByIdController()
const createUserController = makeCreateUserController()
const updateUserController = makeUpdateUserController()
const deleteUserController = makeDeleteController()

app.get('/api/users/:id', async (request, response) => {
    const getUserByIdResponse = await getUserByIdController.execute(request)

    response
        .status(getUserByIdResponse.statusCode)
        .json(getUserByIdResponse.body)
})
app.post('/api/users', async (request, response) => {
    const createUserResponse = await createUserController.execute(request)

    //createUserResponse = {statusCode, body}
    response.status(createUserResponse.statusCode).json(createUserResponse.body)
})
app.patch('/api/users/:id', async (request, response) => {
    const updateUserResponse = await updateUserController.execute(request)

    response.status(updateUserResponse.statusCode).json(updateUserResponse.body)
})
app.delete('/api/users/:id', async (request, response) => {
    const deleteUserResponse = await deleteUserController.execute(request)

    response.status(deleteUserResponse.statusCode).json(deleteUserResponse.body)
})

//TRANSACTION ROUTE//
const createTransactionController = makeCreateTransactionController()
app.post('/api/transactions', async (request, response) => {
    const createTransactionResponse =
        await createTransactionController.execute(request)

    response
        .status(createTransactionResponse.statusCode)
        .json(createTransactionResponse.body)
})

//LISTEN//

app.listen(process.env.PORT_API, () => {
    console.log('Abrindo o predio 8080!')
})
