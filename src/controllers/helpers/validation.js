import validator from 'validator'
import { badRequest } from './index.js'

export const checkIfIdIsValid = (id) => validator.isUUID(id)
export const invalidIdResponse = () =>
    badRequest({ message: 'The Id is not valid' })

export const validateRequiredFields = (params, requiredFields) => {
    for (const field of requiredFields) {
        if (params[field] === undefined || params[field] === null) {
            return {
                missing: field,
                ok: false,
            }
        }

        if (
            typeof params[field] === 'string' &&
            params[field].trim().length === 0
        ) {
            return {
                missing: field,
                ok: false,
            }
        }
    }
    return {
        ok: true,
        missing: undefined,
    }
}
