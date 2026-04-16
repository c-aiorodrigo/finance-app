import { GetUserByIdController } from './get-user-by-id.js'
import { faker } from '@faker-js/faker'

const makeSut = () => {
    const getUserByIdUseCaseMock = {
        execute: jest.fn(),
    }

    const sut = new GetUserByIdController(getUserByIdUseCaseMock)

    return { sut, getUserByIdUseCaseMock }
}

const fakeUser = () => ({
    params: {
        id: faker.string.uuid(),
    },
})

describe('Get User Bu Id Controller', () => {
    it('should get user by id', async () => {
        //ARRANGE
        const { sut, getUserByIdUseCaseMock } = makeSut()
        const httpReq = fakeUser()

        getUserByIdUseCaseMock.execute.mockResolvedValue(httpReq.params.id)

        //ACT

        const user = await sut.execute(httpReq)

        //ASSERT
        expect(user.statusCode).toBe(200)
    })

    it('should fail if user id is not found', async () => {
        const { sut, getUserByIdUseCaseMock } = makeSut()
        const httpReq = fakeUser()

        getUserByIdUseCaseMock.execute.mockResolvedValue(null)

        const user = await sut.execute(httpReq)

        //ASSERT
        expect(user.statusCode).toBe(404)
    })

    it('should fail if id is invalid', async () => {
        const { sut, getUserByIdUseCaseMock } = makeSut()
        const httpReq = { params: { id: 'invalid_id' } }

        const idInvalid = await sut.execute(httpReq)

        expect(idInvalid.statusCode).toBe(400)
        expect(getUserByIdUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('Should tell me that system is down', async () => {
        //ARRANGE
        const { sut, getUserByIdUseCaseMock } = makeSut()
        const httpReq = fakeUser()

        getUserByIdUseCaseMock.execute.mockRejectedValue(
            new Error('DataBase is Down'),
        )

        jest.spyOn(console, 'error').mockImplementation(() => {})
        //ACT
        const response = await sut.execute(httpReq)

        //ASSERT

        expect(response.statusCode).toBe(500)
    })
})
