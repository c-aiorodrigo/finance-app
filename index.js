import 'dotenv/config'
import express from 'express'
import { CreateUserController } from './src/controllers/create-user.js'
import { GetUserByIdController } from './src/controllers/get-user-by-id.js'

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

app.listen(process.env.PORT_API, () => {
    console.log('Abrindo o predio 8080!')
})
