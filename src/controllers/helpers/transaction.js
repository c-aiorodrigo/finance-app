import validator from 'validator'
import { badRequest } from './http.js'

export const invalidTypeResponse = () =>
    badRequest({
        message: 'The type must be EARNING, EXPENSE or INVESTMENT',
    })

//ID//

export const checkIfTransactionIdIsValid = (id) => validator.isUUID(id)
export const invalidTransactionIdResponse = () =>
    badRequest({
        message: 'The Transaction ID is not valid',
    })
