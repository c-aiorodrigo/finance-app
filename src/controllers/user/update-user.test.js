import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user'
import { EmailAlreadyInUse } from '../../error'

const makeSut = () => {
    const updateUserUseCaseMock = {
        execute: jest.fn(),
    }

    const sut = new UpdateUserController(updateUserUseCaseMock)

    return { sut, updateUserUseCaseMock }
}

const makeFakeRequest = () => ({
    params: {
        id: faker.string.uuid(),
    },
    body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: 'SenhaSuperForte123!',
    },
})

describe('Update User', () => {
    it('should update an user', async () => {
        const { sut, updateUserUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPasswod } = httpReq.body
        const userToUpdate = { id: httpReq.params.id, ...userWithoutPasswod }

        updateUserUseCaseMock.execute.mockResolvedValue(userToUpdate)

        const updatedUser = await sut.execute(httpReq)

        expect(updatedUser.statusCode).toBe(200)
        expect(updateUserUseCaseMock.execute).toHaveBeenCalledTimes(1)
    })

    it('should fail if email provided is invalid', async () => {
        const { sut, updateUserUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPasswod } = httpReq.body
        const userToUpdate = {
            id: httpReq.params.id,
            ...userWithoutPasswod,
        }

        updateUserUseCaseMock.execute.mockResolvedValue(userToUpdate)

        const updatedUser = await sut.execute({
            params: httpReq.params,
            body: {
                ...httpReq.body,
                email: 'invalid_email',
            },
        })

        expect(updatedUser.statusCode).toBe(400)
        expect(updateUserUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if the password provided is invalid', async () => {
        const { sut, updateUserUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()
        // eslint-disable-next-line no-unused-vars
        const { password, ...userWithoutPasswod } = httpReq.body
        const userToUpdate = {
            id: httpReq.params.id,
            ...userWithoutPasswod,
        }

        updateUserUseCaseMock.execute.mockResolvedValue(userToUpdate)

        const updatedUser = await sut.execute({
            params: httpReq.params,
            body: {
                ...httpReq.body,
                password: '123',
            },
        })

        expect(updatedUser.statusCode).toBe(400)
        expect(updateUserUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if the body is empty', async () => {
        const { sut, updateUserUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        const updatedUser = await sut.execute({
            params: httpReq.params,
            body: {},
        })

        expect(updatedUser.statusCode).toBe(400)
        expect(updateUserUseCaseMock.execute).not.toHaveBeenCalled()
    })
    it('should fail if id is invalid', async () => {
        const { sut, updateUserUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        const updatedUser = await sut.execute({
            params: { id: 'invalid_id' },
            body: {
                ...httpReq.body,
            },
        })

        expect(updatedUser.statusCode).toBe(400)
        expect(updateUserUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if the body has an unallowed field', async () => {
        const { sut, updateUserUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        const updatedUser = await sut.execute({
            params: httpReq.params,
            body: {
                ...httpReq.body,
                casa: 'unawolled',
            },
        })

        expect(updatedUser.statusCode).toBe(400)
        expect(updateUserUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('Should tell me that system is down', async () => {
        //ARRANGE
        const { sut, updateUserUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        updateUserUseCaseMock.execute.mockRejectedValue(
            new Error('DataBase is Down'),
        )

        jest.spyOn(console, 'error').mockImplementation(() => {})
        //ACT
        const updatedUser = await sut.execute({
            params: httpReq.params,
            body: {
                ...httpReq.body,
            },
        })

        //ASSERT

        expect(updatedUser.statusCode).toBe(500)
        expect(updateUserUseCaseMock.execute).toHaveBeenCalledTimes(1)
    })

    it('Should told me that email already exist', async () => {
        //ARRANGE
        const { sut, updateUserUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()
        updateUserUseCaseMock.execute.mockRejectedValue(
            new EmailAlreadyInUse(httpReq.body.email),
        )

        //ACT
        const emailUsed = await sut.execute(httpReq)

        //ASSERT
        expect(emailUsed.statusCode).toBe(400)
        expect(emailUsed.body).toEqual({
            message: new EmailAlreadyInUse(httpReq.body.email).message,
        })
        expect(updateUserUseCaseMock.execute).toHaveBeenCalledTimes(1)
    })
})
