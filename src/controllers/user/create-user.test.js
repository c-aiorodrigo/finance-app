import { EmailAlreadyInUse } from '../../error/user.js'
import { CreateUserController } from '../index.js'
import { faker } from '@faker-js/faker'

describe('Create User Controller', () => {
    it('should create an user', async () => {
        //ARRANGE
        const httpReq = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            },
        }

        const createUserUseCaseMock = {
            execute: jest.fn().mockResolvedValue(httpReq.body),
        }
        const createUserController = new CreateUserController(
            createUserUseCaseMock,
        )
        //act

        const createdUser = await createUserController.execute(httpReq)

        //ASSERT
        expect(createdUser.statusCode).toBe(201)
        expect(createdUser).not.toBeUndefined()
        expect(createdUser).not.toBeNull()

        expect(createUserUseCaseMock.execute).toHaveBeenCalledTimes(1)

        expect(createUserUseCaseMock.execute).toHaveBeenCalledWith({
            firstName: httpReq.body.first_name,
            lastName: httpReq.body.last_name,
            email: httpReq.body.email,
            password: httpReq.body.password,
        })
    })

    it('Should told me that email aready exist', async () => {
        //ARRAGE
        const httpReq = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            },
        }
        const createUserUseCaseMock = {
            execute: jest
                .fn()
                .mockRejectedValue(new EmailAlreadyInUse(httpReq.body.email)),
        }
        const createUserController = new CreateUserController(
            createUserUseCaseMock,
        )

        //ACT

        const emailUsed = await createUserController.execute(httpReq)

        //ASSERT

        expect(emailUsed.statusCode).toBe(400)
        expect(emailUsed.body).toEqual({
            message: new EmailAlreadyInUse(httpReq.body.email).message,
        })
        expect(createUserUseCaseMock.execute).toHaveBeenCalledTimes(1)
    })

    it('Should tell me that some field is not provide correctly', async () => {
        //ARRANGE

        const httpReq = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: 'email_invalid',
                password: faker.internet.password(),
            },
        }

        const createUseUserCaseMock = {
            execute: jest.fn(),
        }

        const createUserController = new CreateUserController(
            createUseUserCaseMock,
        )

        //ACT

        const response = await createUserController.execute(httpReq)

        //ASSERT

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')

        expect(createUseUserCaseMock.execute).not.toHaveBeenCalledTimes(1)
    })

    it('Should tell me that system is down', async () => {
        const httpReq = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            },
        }

        const createUseUserCaseMock = {
            execute: jest.fn().mockRejectedValue(new Error('DataBase is Down')),
        }

        const createUserController = new CreateUserController(
            createUseUserCaseMock,
        )

        //ACT

        const response = await createUserController.execute(httpReq)

        //ASSERT

        expect(response.statusCode).toBe(500)
    })
})
