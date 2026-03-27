import 'dotenv/config'
import express from 'express'
import {
    makeDeleteController,
    makeGetUserByIdController,
    makeUpdateUserController,
    makeCreateUserController,
} from './src/factories/controllers/user.js'

const app = express()
app.use(express.json())

//USER ROUTES//
app.get('/api/users/:id', async (request, response) => {
    const getUserByIdController = makeGetUserByIdController()
    const getUserByIdResponse = await getUserByIdController.execute(request)

    response
        .status(getUserByIdResponse.statusCode)
        .json(getUserByIdResponse.body)
})
app.post('/api/users', async (request, response) => {
    const createUserController = makeCreateUserController()
    const createUserResponse = await createUserController.execute(request)

    //createUserResponse = {statusCode, body}
    response.status(createUserResponse.statusCode).json(createUserResponse.body)
})
app.patch('/api/users/:id', async (request, response) => {
    const updateUserController = makeUpdateUserController()
    const updateUserResponse = await updateUserController.execute(request)

    response.status(updateUserResponse.statusCode).json(updateUserResponse.body)
})
app.delete('/api/users/:id', async (request, response) => {
    const deleteUserController = makeDeleteController()
    const deleteUserResponse = await deleteUserController.execute(request)

    response.status(deleteUserResponse.statusCode).json(deleteUserResponse.body)
})

//LISTEN//

app.listen(process.env.PORT_API, () => {
    console.log('Abrindo o predio 8080!')
})
