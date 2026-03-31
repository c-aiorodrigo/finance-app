import {
    checkIfIdIsValid,
    internalServerError,
    invalidIdResponse,
    created,
    validateRequiredFields,
    requiredFieldsIsMissingResponse,
    checkIfAmountIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidTypeResponse,
} from '../helpers/index.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpReq) {
        try {
            const params = httpReq.body

            const requiredFields = ['userId', 'name', 'date', 'amount', 'type']

            //Validando o campos obrigatorios
            const { ok: requiredFieldsIsOk, missing: missingFields } =
                validateRequiredFields(params, requiredFields)
            if (!requiredFieldsIsOk) {
                return requiredFieldsIsMissingResponse(missingFields)
            }

            //validando user id
            const userId = params.userId
            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            //validando montante
            const isAmountValid = checkIfAmountIsValid(params.amount)

            if (!isAmountValid) {
                return invalidAmountResponse()
            }

            //validando type
            const isTypeValid = checkIfTypeIsValid(type)

            if (!isTypeValid) {
                return invalidTypeResponse()
            }

            const type = params.type.trim().toUpperCase()
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
