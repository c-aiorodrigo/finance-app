import {
    CreateTransactionController,
    GetTransactionsByUserIdController,
} from '../../controllers/index.js'
import { UpdateTransactionController } from '../../controllers/transaction/update-transaction.js'
import {
    PostgresCreateTransactionRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateTransactionRepository,
} from '../../repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    GetTransactionsByUserIdUseCase,
} from '../../use-cases/index.js'
import { UpdateTransactionUseCase } from '../../use-cases/transaction/update-transaction.js'

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
    const getTransactionByIdRepository =
        new PostgresGetTransactionsByUserIdRepository()
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
