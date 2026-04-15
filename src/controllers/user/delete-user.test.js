import { DeleteUserController } from '../index.js'
import { faker } from '@faker-js/faker'

const makeSut = () => {
    const deleteUserUseCaseMock = {
        execute: jest.fn(),
    }
    const sut = new DeleteUserController(deleteUserUseCaseMock)
    return { sut, deleteUserUseCaseMock }
}

const fakeUser = () => ({
    params: {
        id: faker.string.uuid(),
    },
})

describe('Delete User Controller', () => {
    it('should delete a user', async () => {
        //ARRANGE
        const { sut, deleteUserUseCaseMock } = makeSut()
        const httpReq = fakeUser()

        deleteUserUseCaseMock.execute.mockResolvedValue(httpReq.params.id)
        //act
        const deletedUser = await sut.execute(httpReq)

        //ASSERT
        expect(deletedUser.statusCode).toBe(200)

        expect(deleteUserUseCaseMock.execute).toHaveBeenCalledTimes(1)
    })

    it('should fail if id is invalid', async () => {
        const { sut, deleteUserUseCaseMock } = makeSut()
        const httpReq = { params: { id: 'invalid_id' } }

        const idInvalid = await sut.execute(httpReq)

        expect(idInvalid.statusCode).toBe(400)
        expect(deleteUserUseCaseMock.execute).not.toHaveBeenCalled()
    })

    it('Should fail if the user not found', async () => {
        const { sut, deleteUserUseCaseMock } = makeSut()
        const httpReq = fakeUser()

        deleteUserUseCaseMock.execute.mockResolvedValue(null)

        const response = await sut.execute(httpReq)

        expect(response.statusCode).toBe(404)
    })

    it('Should tell me that system is down', async () => {
        //ARRANGE
        const { sut, deleteUserUseCaseMock } = makeSut()
        const httpReq = fakeUser()

        deleteUserUseCaseMock.execute.mockRejectedValue(
            new Error('DataBase is Down'),
        )

        jest.spyOn(console, 'error').mockImplementation(() => {})
        //ACT
        const response = await sut.execute(httpReq)

        //ASSERT

        expect(response.statusCode).toBe(500)
    })
})
