import validator from 'validator'
import {
    badRequest,
    checkIfIdIsValid,
    internalServerError,
    invalidIdResponse,
    created,
    validateRequiredFields,
} from '../helpers/index.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpReq) {
        try {
            const params = httpReq.body

            const requiredFields = ['userId', 'name', 'date', 'amount', 'type']

            const requiredFieldsValidation = validateRequiredFields(
                params,
                requiredFields,
            )
            if (!requiredFieldsValidation.ok) {
                return badRequest({
                    message: `The field ${requiredFieldsValidation.missing} can not be empty`,
                })
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
                    digits_after_decimal: [1, 2],
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
