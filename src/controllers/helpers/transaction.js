import validator from 'validator'
import { badRequest } from './http.js'

//MONTANTE//
export const checkIfAmountIsValid = (amount) =>
    validator.isCurrency(amount.toString(), {
        digits_after_decimal: [1, 2],
        allow_decimal: true,
        decimal_separator: '.',
    })

export const invalidAmountResponse = () =>
    badRequest({
        message: 'The amount must be a valid currency! ',
    })

//TIPO DE TRANSAÇÃO//

export const checkIfTypeIsValid = (type) => {
    if (typeof type !== 'string') {
        return false
    }
    return ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(
        type.trim().toUpperCase(),
    )
}

export const invalidTypeResponse = () =>
    badRequest({
        message: 'The type must be EARNING, EXPENSE or INVESTMENT',
    })
