import 'dotenv/config'
import express from 'express'
import { CreateUserController } from './src/controllers/create-user.js'

const app = express()
app.use(express.json())

app.post('/api/users', async (request, response) => {
    const createUserController = new CreateUserController()

    //createUserResponse = {statusCode, body}
    const createUserResponse = await createUserController.execute(request)

    response.status(createUserResponse.statusCode).json(createUserResponse.body)
})

app.listen(process.env.PORT_API, () => {
    console.log('Abrindo o predio 8080!')
})
