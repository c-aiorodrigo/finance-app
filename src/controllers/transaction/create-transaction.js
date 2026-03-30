import validator from 'validator'
import {
    badRequest,
    checkIfIdIsValid,
    internalServerError,
    invalidIdResponse,
    created,
} from '../helpers/index.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpReq) {
        try {
            const params = httpReq.body

            const requiredFields = ['userId', 'name', 'date', 'amount', 'type']

            for (const field of requiredFields) {
                if (params[field] === undefined || params[field] === null) {
                    return badRequest({
                        message: 'The fields can not be empty!',
                    })
                }

                if (
                    typeof params[field] === 'string' &&
                    params[field].trim().length === 0
                ) {
                    return badRequest({
                        message: 'The fields can not be empty!',
                    })
                }
            }

            //validando user id
            const userId = params.userId

            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) {
                return invalidIdResponse()
            }

            if (params.amount <= 0) {
                return badRequest({
                    message: 'The amount must be greater then 0',
                })
            }

            //validando montante
            const isAmountValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
                    require_decimal: true,
                    decimal_separator: '.',
                },
            )

            if (!isAmountValid) {
                return badRequest({
                    message: 'The amount must be a valid currency! ',
                })
            }

            //validando type
            const type = params.type.trim().toUpperCase()
            const isTypeValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(
                type,
            )
            if (!isTypeValid) {
                return badRequest({
                    message: 'The type must be EARNING, EXPENSE or INVESTMENT',
                })
            }

            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            })

            return created(transaction)
        } catch (error) {
            console.error(error)
            return internalServerError()
        }
    }
}
