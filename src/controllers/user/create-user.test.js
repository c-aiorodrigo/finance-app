import { CreateUserController } from '../index.js'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    it('should create an user', async () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpReq = {
            body: {
                first_name: 'Caio',
                last_name: 'Rodrigo',
                email: 'caio@gmail.com',
                password: 'eu515151',
            },
        }

        const createdUser = await createUserController.execute(httpReq)

        //act

        expect(createdUser.statusCode).toBe(201)
        expect(createdUser).not.toBeUndefined()
        expect(createdUser).not.toBeNull()
    })
})
