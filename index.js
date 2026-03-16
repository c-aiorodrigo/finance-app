import 'dotenv/config'
import express from 'express'
import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
} from './src/controllers/index.js'

const app = express()
app.use(express.json())

//GET//
app.get('/api/users/:id', async (request, response) => {
    const getUserByIdController = new GetUserByIdController()

    const getUserByIdResponse = await getUserByIdController.execute(request)

    response
        .status(getUserByIdResponse.statusCode)
        .json(getUserByIdResponse.body)
})

//POST//
app.post('/api/users', async (request, response) => {
    const createUserController = new CreateUserController()

    //createUserResponse = {statusCode, body}
    const createUserResponse = await createUserController.execute(request)

    response.status(createUserResponse.statusCode).json(createUserResponse.body)
})

//PATCH//
app.patch('/api/users/:id', async (request, response) => {
    const updateUserController = new UpdateUserController()

    const updateUserResponse = await updateUserController.execute(request)

    response.status(updateUserResponse.statusCode).json(updateUserResponse.body)
})

//DELELTE//
app.delete('/api/user/:id', async (request, response) => {
    const deleteUserController = new DeleteUserController()

    const deleteUserResponse = await deleteUserController.execute(request)

    response.status(deleteUserResponse.statusCode).json(deleteUserResponse.body)
})

app.listen(process.env.PORT_API, () => {
    console.log('Abrindo o predio 8080!')
})
