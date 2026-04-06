import 'dotenv/config'
import express from 'express'
import {
    makeDeleteController,
    makeGetUserByIdController,
    makeUpdateUserController,
    makeCreateUserController,
    makeGetUserBalanceController,
} from './src/factories/controllers/user.js'
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
} from './src/factories/controllers/transaction.js'

const app = express()
app.use(express.json())

//USER ROUTES//
const getUserByIdController = makeGetUserByIdController()
const createUserController = makeCreateUserController()
const updateUserController = makeUpdateUserController()
const deleteUserController = makeDeleteController()
const getUserBalanceController = makeGetUserBalanceController()

app.get('/api/users/:id', async (request, response) => {
    const getUserByIdResponse = await getUserByIdController.execute(request)

    response
        .status(getUserByIdResponse.statusCode)
        .json(getUserByIdResponse.body)
})
app.get('/api/users/:userId/balance', async (request, response) => {
    const getUserBalanceResponse =
        await getUserBalanceController.execute(request)

    response
        .status(getUserBalanceResponse.statusCode)
        .json(getUserBalanceResponse.body)
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
const getTransactionsByUserIdController =
    makeGetTransactionsByUserIdController()
const updateTransactionController = makeUpdateTransactionController()
const deleteTransactionController = makeDeleteTransactionController()

app.post('/api/transactions', async (request, response) => {
    const createTransactionResponse =
        await createTransactionController.execute(request)

    response
        .status(createTransactionResponse.statusCode)
        .json(createTransactionResponse.body)
})

app.get('/api/transactions', async (request, response) => {
    const getTransactionsByUserIdResponse =
        await getTransactionsByUserIdController.execute(request)

    response
        .status(getTransactionsByUserIdResponse.statusCode)
        .json(getTransactionsByUserIdResponse.body)
})

app.patch('/api/transactions/:id', async (request, response) => {
    const updateTransactionResponse =
        await updateTransactionController.execute(request)

    response
        .status(updateTransactionResponse.statusCode)
        .json(updateTransactionResponse.body)
})

app.delete('/api/transactions/:id', async (request, response) => {
    const deleteTransactionResponse =
        await deleteTransactionController.execute(request)

    response
        .status(deleteTransactionResponse.statusCode)
        .json(deleteTransactionResponse.body)
})

//LISTEN//

app.listen(process.env.PORT_API, () => {
    console.log('Abrindo o predio 8080!')
})
