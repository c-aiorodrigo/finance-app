import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction.js'

const makeSut = () => {
    const deleteTransactionUseCaseMock = {
        execute: jest.fn(),
    }

    const sut = new DeleteTransactionController(deleteTransactionUseCaseMock)

    return { sut, deleteTransactionUseCaseMock }
}

const makeFakeRequest = () => ({
    params: {
        id: faker.string.uuid(),
    },
    query: {
        userId: faker.string.uuid(),
    },
})

describe('Delete Transaction Controller', () => {
    it('should delete a transaction', async () => {
        const { sut, deleteTransactionUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        deleteTransactionUseCaseMock.execute.mockResolvedValue(httpReq)

        const deletedTransaction = await sut.execute(httpReq)

        expect(deletedTransaction.statusCode).toBe(200)
        expect(deleteTransactionUseCaseMock.execute).toHaveBeenCalledTimes(1)
    })

    it('should fail if id is invalid', async () => {
        const { sut, deleteTransactionUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        const deletedTransaction = await sut.execute({
            params: {
                id: 'invalid',
            },
            query: httpReq.query,
        })

        expect(deletedTransaction.statusCode).toBe(400)
        expect(deleteTransactionUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if user id is invalid', async () => {
        const { sut, deleteTransactionUseCaseMock } = makeSut()

        const deletedTransaction = await sut.execute({
            params: {
                id: faker.string.uuid(),
            },
            query: {
                userId: 'invalid',
            },
        })

        expect(deletedTransaction.statusCode).toBe(400)
        expect(deleteTransactionUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if id not exist', async () => {
        const { sut, deleteTransactionUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        deleteTransactionUseCaseMock.execute.mockResolvedValue(null)

        const deletedTransaction = await sut.execute(httpReq)

        expect(deletedTransaction.statusCode).toBe(404)
        expect(deleteTransactionUseCaseMock.execute).toHaveBeenCalledTimes(1)
    })

    it('Should tell me that system is down', async () => {
        //ARRANGE
        const { sut, deleteTransactionUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        deleteTransactionUseCaseMock.execute.mockRejectedValue(
            new Error('DataBase is Down'),
        )

        jest.spyOn(console, 'error').mockImplementation(() => {})
        //ACT
        const response = await sut.execute(httpReq)

        //ASSERT

        expect(response.statusCode).toBe(500)
    })
})
