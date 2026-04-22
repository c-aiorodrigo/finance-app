import { UserNotFoundError } from '../../error/user.js'
import { GetUserBalanceController } from '../index.js'
import { faker } from '@faker-js/faker'

const makeSut = () => {
    const getUserBalanceUseCaseMock = {
        execute: jest.fn(),
    }

    const sut = new GetUserBalanceController(getUserBalanceUseCaseMock)

    return { sut, getUserBalanceUseCaseMock }
}
const fakeUser = () => ({
    params: {
        userId: faker.string.uuid(),
    },
})

const fakeBalance = () => {
    const earnings = Number(faker.finance.amount())
    const expenses = Number(faker.finance.amount())
    const investments = Number(faker.finance.amount())

    return {
        earnings,
        expenses,
        investments,
        balance: earnings + expenses + investments,
    }
}

describe('Get User Balance Controller', () => {
    it('Should get user balance', async () => {
        const { sut, getUserBalanceUseCaseMock } = makeSut()
        const httpReq = fakeUser()
        const userBalance = fakeBalance()

        getUserBalanceUseCaseMock.execute.mockResolvedValue(userBalance)

        const balance = await sut.execute(httpReq)

        expect(balance.statusCode).toBe(200)
        expect(getUserBalanceUseCaseMock.execute).toHaveBeenCalledTimes(1)
    })

    it('Should fail if userId is not provided', async () => {
        const { sut } = makeSut()

        const balance = await sut.execute({
            params: {
                userId: '',
            },
        })

        expect(balance.statusCode).toBe(400)
    })

    it('Should fail if userId is invalid', async () => {
        const { sut } = makeSut()

        const balance = await sut.execute({
            params: {
                userId: 'invalid',
            },
        })

        expect(balance.statusCode).toBe(400)
    })

    it('Should fail if user not have balance to show', async () => {
        const { sut, getUserBalanceUseCaseMock } = makeSut()
        const httpReq = fakeUser()

        getUserBalanceUseCaseMock.execute.mockResolvedValue(null)

        const balance = await sut.execute(httpReq)

        expect(balance.statusCode).toBe(404)
    })

    it('Should fail if the system down', async () => {
        const { sut, getUserBalanceUseCaseMock } = makeSut()
        const httpReq = fakeUser()

        getUserBalanceUseCaseMock.execute.mockRejectedValue(
            new Error('Database is Down'),
        )

        jest.spyOn(console, 'error').mockImplementation(() => {})

        const response = await sut.execute(httpReq)

        expect(response.statusCode).toBe(500)
    })

    it('Should fail if user is not found', async () => {
        const { sut, getUserBalanceUseCaseMock } = makeSut()
        const httpReq = fakeUser()

        getUserBalanceUseCaseMock.execute.mockRejectedValue(
            new UserNotFoundError('User not found'),
        )

        jest.spyOn(console, 'error').mockImplementation(() => {})

        const response = await sut.execute(httpReq)

        expect(response.statusCode).toBe(404)
    })
})
