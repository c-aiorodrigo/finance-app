import { UpdateTransactionController } from './update-transaction.js'
import { faker } from '@faker-js/faker'

const makeSut = () => {
    const updateTransactionUseCaseMock = {
        execute: jest.fn(),
    }

    const sut = new UpdateTransactionController(updateTransactionUseCaseMock)

    return { sut, updateTransactionUseCaseMock }
}

const makeFakeRequest = () => ({
    params: {
        id: faker.string.uuid(),
    },
    query: {
        userId: faker.string.uuid(),
    },
    body: {
        name: faker.finance.transactionDescription(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'earning',
    },
})

describe('Update Transaction Controller ', () => {
    it('should update a transaction', async () => {
        const { sut, updateTransactionUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        updateTransactionUseCaseMock.execute.mockResolvedValue(httpReq)

        const updatedTransaction = await sut.execute(httpReq)

        expect(updatedTransaction.statusCode).toBe(200)
        expect(updateTransactionUseCaseMock.execute).toHaveBeenCalledTimes(1)
    })

    it('should fail if the body is empty', async () => {
        const { sut, updateTransactionUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        updateTransactionUseCaseMock.execute.mockResolvedValue(httpReq)

        const updateTransaction = await sut.execute({
            params: httpReq.params,
            query: httpReq.query,
            body: {},
        })

        expect(updateTransaction.statusCode).toBe(400)
        expect(updateTransactionUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if amount is invalid', async () => {
        const { sut, updateTransactionUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        updateTransactionUseCaseMock.execute.mockResolvedValue(httpReq)

        const updateTransaction = await sut.execute({
            params: httpReq.params,
            query: httpReq.query,
            body: { ...httpReq.body, amount: 'invalid' },
        })

        expect(updateTransaction.statusCode).toBe(400)
        expect(updateTransactionUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if type is invalid', async () => {
        const { sut, updateTransactionUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        updateTransactionUseCaseMock.execute.mockResolvedValue(httpReq)

        const updateTransaction = await sut.execute({
            params: httpReq.params,
            query: httpReq.query,
            body: { ...httpReq.body, type: 'invalid' },
        })

        expect(updateTransaction.statusCode).toBe(400)
        expect(updateTransactionUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if date is invalid', async () => {
        const { sut, updateTransactionUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        updateTransactionUseCaseMock.execute.mockResolvedValue(httpReq)

        const updateTransaction = await sut.execute({
            params: httpReq.params,
            query: httpReq.query,
            body: { ...httpReq.body, date: 'invalid' },
        })

        expect(updateTransaction.statusCode).toBe(400)
        expect(updateTransactionUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if the has an unallowed filed', async () => {
        const { sut, updateTransactionUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        updateTransactionUseCaseMock.execute.mockResolvedValue(httpReq)

        const updateTransaction = await sut.execute({
            params: httpReq.params,
            query: httpReq.query,
            body: { ...httpReq.body, casa: 'invalid' },
        })

        expect(updateTransaction.statusCode).toBe(400)
        expect(updateTransactionUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if user id is invalid', async () => {
        const { sut, updateTransactionUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        updateTransactionUseCaseMock.execute.mockResolvedValue(httpReq)

        const updateTransaction = await sut.execute({
            params: httpReq.params,
            query: { userId: 'invalid' },
            body: httpReq.body,
        })

        expect(updateTransaction.statusCode).toBe(400)
        expect(updateTransactionUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if transaction id is invalid', async () => {
        const { sut, updateTransactionUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        updateTransactionUseCaseMock.execute.mockResolvedValue(httpReq)

        const updateTransaction = await sut.execute({
            params: { id: 'invalid' },
            query: httpReq.query,
            body: httpReq.body,
        })

        expect(updateTransaction.statusCode).toBe(400)
        expect(updateTransactionUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if system is down', async () => {
        const { sut, updateTransactionUseCaseMock } = makeSut()
        const httpReq = makeFakeRequest()

        updateTransactionUseCaseMock.execute.mockRejectedValue(
            new Error('System is Down'),
        )
        jest.spyOn(console, 'error').mockImplementation(() => {})
        const updateTransaction = await sut.execute(httpReq)

        expect(updateTransaction.statusCode).toBe(500)
        expect(updateTransactionUseCaseMock.execute).toHaveBeenCalledTimes(1)
    })
})
