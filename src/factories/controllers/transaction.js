import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionsByUserIdController,
} from '../../controllers/index.js'
import { UpdateTransactionController } from '../../controllers/transaction/update-transaction.js'
import {
    PostgresCreateTransactionRepository,
    PostgresDeleteTransactionRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresGetUserByIdRepository,
    PostgresTransactionByIdRepository,
    PostgresUpdateTransactionRepository,
} from '../../repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    DeleteTransactionUseCase,
    GetTransactionsByUserIdUseCase,
    UpdateTransactionUseCase,
} from '../../use-cases/index.js'

//POST//
export const makeCreateTransactionController = () => {
    const getUserById = new PostgresGetUserByIdRepository()
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserById,
    )
    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )

    return createTransactionController
}

//GET//
export const makeGetTransactionsByUserIdController = () => {
    const getTransactionsByUserIdRepository =
        new PostgresGetTransactionsByUserIdRepository()
    const getUserById = new PostgresGetUserByIdRepository()
    const getTransacrionByUserIdUseCase = new GetTransactionsByUserIdUseCase(
        getTransactionsByUserIdRepository,
        getUserById,
    )
    const getTransacrionsByUserIdController =
        new GetTransactionsByUserIdController(getTransacrionByUserIdUseCase)

    return getTransacrionsByUserIdController
}

//PATCH//
export const makeUpdateTransactionController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getTransactionByIdRepository = new PostgresTransactionByIdRepository()
    const updateTransactionRepository =
        new PostgresUpdateTransactionRepository()

    const updateTransactionUseCase = new UpdateTransactionUseCase(
        getUserByIdRepository,
        getTransactionByIdRepository,
        updateTransactionRepository,
    )

    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
    )

    return updateTransactionController
}

//DELETE//
export const makeDeleteTransactionController = () => {
    const getTransactionByIdRepository = new PostgresTransactionByIdRepository()
    const getUserById = new PostgresGetUserByIdRepository()
    const deleteTransactionRepository =
        new PostgresDeleteTransactionRepository()

    const deleteTransctionUseCase = new DeleteTransactionUseCase(
        getTransactionByIdRepository,
        getUserById,
        deleteTransactionRepository,
    )

    const deleteTransactionController = new DeleteTransactionController(
        deleteTransctionUseCase,
    )

    return deleteTransactionController
}
