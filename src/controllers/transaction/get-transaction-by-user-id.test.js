import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transaction-by-user-id.js'

const makeSut = () => {
    const getTransactionByUserIdUseCaseMock = {
        execute: jest.fn(),
    }

    const sut = new GetTransactionsByUserIdController(
        getTransactionByUserIdUseCaseMock,
    )

    return { sut, getTransactionByUserIdUseCaseMock }
}

const makeFakeRequest = () => ({
    query: {
        userId: faker.string.uuid(),
    },
})

describe('Get Transaction By User Id', () => {
    it('should get transaction by user id', async () => {
        const { sut, getTransactionByUserIdUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        getTransactionByUserIdUseCaseMock.execute.mockResolvedValue(httpReq)

        const response = await sut.execute(httpReq)

        expect(response.statusCode).toBe(200)
        expect(getTransactionByUserIdUseCaseMock.execute).toHaveBeenCalledTimes(
            1,
        )
    })

    it('should fail if user id is invalid', async () => {
        const { sut, getTransactionByUserIdUseCaseMock } = makeSut()

        const response = await sut.execute({
            query: {
                userId: 'invalid',
            },
        })

        expect(response.statusCode).toBe(400)
        expect(getTransactionByUserIdUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if user id is empty', async () => {
        const { sut, getTransactionByUserIdUseCaseMock } = makeSut()

        const response = await sut.execute({
            query: {
                userId: '',
            },
        })

        expect(response.statusCode).toBe(400)
        expect(getTransactionByUserIdUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should return 404 if user not have transactions', async () => {
        const { sut, getTransactionByUserIdUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        getTransactionByUserIdUseCaseMock.execute.mockResolvedValue(null)

        const response = await sut.execute(httpReq)

        expect(response.statusCode).toBe(404)
        expect(getTransactionByUserIdUseCaseMock.execute).toHaveBeenCalled()
    })

    it('Should tell me that system is down', async () => {
        //ARRANGE
        const { sut, getTransactionByUserIdUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        getTransactionByUserIdUseCaseMock.execute.mockRejectedValue(
            new Error('DataBase is Down'),
        )

        jest.spyOn(console, 'error').mockImplementation(() => {})
        //ACT
        const response = await sut.execute(httpReq)

        //ASSERT

        expect(response.statusCode).toBe(500)
    })
})
