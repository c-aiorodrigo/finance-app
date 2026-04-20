import { CreateTransactionController } from './create-transaction.js'
import { faker } from '@faker-js/faker'

const makeSut = () => {
    const createTransactionMock = {
        execute: jest.fn(),
    }

    const sut = new CreateTransactionController(createTransactionMock)

    return { sut, createTransactionMock }
}

const makeFakeRequest = () => ({
    body: {
        user_id: faker.string.uuid(),
        name: faker.finance.transactionDescription(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'earning',
    },
})

describe('Create Transaction Controller', () => {
    it('should create a transaction', async () => {
        //ARRANGE
        const { sut, createTransactionMock } = makeSut()
        const httpReq = makeFakeRequest()

        createTransactionMock.execute.mockResolvedValue(httpReq.body)

        //ACT
        const createdTransaction = await sut.execute(httpReq)

        //ASSERT
        expect(createdTransaction.statusCode).toBe(201)
        expect(createTransactionMock.execute).toHaveBeenCalledTimes(1)
    })

    it('should fail if some field is missing', async () => {
        const { sut, createTransactionMock } = makeSut()
        const httpReq = makeFakeRequest()

        const response = await sut.execute({
            body: {
                ...httpReq.body,
                amount: '',
            },
        })

        expect(response.statusCode).toBe(400)
        expect(createTransactionMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if date is invalid', async () => {
        const { sut, createTransactionMock } = makeSut()
        const httpReq = makeFakeRequest()

        const response = await sut.execute({
            body: {
                ...httpReq.body,
                date: 'invalid',
            },
        })

        expect(response.statusCode).toBe(400)
        expect(createTransactionMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if type is invalid', async () => {
        const { sut, createTransactionMock } = makeSut()
        const httpReq = makeFakeRequest()

        const response = await sut.execute({
            body: {
                ...httpReq.body,
                type: 'INVALID',
            },
        })

        expect(response.statusCode).toBe(400)
        expect(createTransactionMock.execute).not.toHaveBeenCalled()
    })

    it('should fail if system throws', async () => {
        const { sut, createTransactionMock } = makeSut()
        const httpReq = makeFakeRequest()

        createTransactionMock.execute.mockRejectedValue(
            new Error('System is down'),
        )

        jest.spyOn(console, 'error').mockImplementation(() => {})

        const response = await sut.execute(httpReq)

        expect(response.statusCode).toBe(500)
    })
})
