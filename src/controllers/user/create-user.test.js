import { EmailAlreadyInUse } from '../../error/user.js'
import { CreateUserController } from '../index.js'
import { faker } from '@faker-js/faker'

const makeSut = () => {
    const createUserUseCaseMock = {
        execute: jest.fn(),
    }

    const sut = new CreateUserController(createUserUseCaseMock)

    return { sut, createUserUseCaseMock }
}

const makeFakeRequest = () => ({
    body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: 'SenhaSuperForte123!',
    },
})

describe('Create User Controller', () => {
    it('should create an user', async () => {
        //ARRANGE
        const { sut, createUserUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        createUserUseCaseMock.execute.mockResolvedValue(httpReq.body)
        //act
        const createdUser = await sut.execute(httpReq)

        //ASSERT
        expect(createdUser.statusCode).toBe(201)

        expect(createUserUseCaseMock.execute).toHaveBeenCalledTimes(1)

        expect(createUserUseCaseMock.execute).toHaveBeenCalledWith(httpReq.body)
    })

    it('Should told me that email already exist', async () => {
        //ARRANGE
        const { sut, createUserUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()
        createUserUseCaseMock.execute.mockRejectedValue(
            new EmailAlreadyInUse(httpReq.body.email),
        )

        //ACT
        const emailUsed = await sut.execute(httpReq)

        //ASSERT
        expect(emailUsed.statusCode).toBe(400)
        expect(emailUsed.body).toEqual({
            message: new EmailAlreadyInUse(httpReq.body.email).message,
        })
        expect(createUserUseCaseMock.execute).toHaveBeenCalledTimes(1)
    })

    it('Should tell me that some field is not provide correctly', async () => {
        //ARRANGE
        const { sut, createUserUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        //ACT
        httpReq.body.email = 'email_invalid'
        const response = await sut.execute(httpReq)

        //ASSERT
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')

        expect(createUserUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('Should tell me that system is down', async () => {
        //ARRANGE
        const { sut, createUserUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        createUserUseCaseMock.execute.mockRejectedValue(
            new Error('DataBase is Down'),
        )

        jest.spyOn(console, 'error').mockImplementation(() => {})
        //ACT
        const response = await sut.execute(httpReq)

        //ASSERT

        expect(response.statusCode).toBe(500)
    })
})
