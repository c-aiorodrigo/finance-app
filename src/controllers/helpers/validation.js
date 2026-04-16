import validator from 'validator'
import { badRequest } from './index.js'

//ID//
export const checkIfIdIsValid = (id) => validator.isUUID(id)
export const invalidIdResponse = () =>
    badRequest({ message: 'The Id is not valid' })

//CAMPOS OBRIGATORIOS//
export const requiredFieldsIsMissingResponse = (field) => {
    return {
        message: `The field ${field} can not be empty`,
    }
}

//VALIDADANDO CAMPOS OBRIGATORIOS//
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

//UPDATE PARAMS//

//SE HÁ CAMPOS PARA ATUALIZAR//

export const checkIfTheBodyIsEmpty = (params) => {
    if (!params) return true
    return Object.keys(params).length === 0
}
export const bodyIsEmptyResponse = () => {
    return badRequest({
        message: 'All fields are empty!',
    })
}

//SE OS CAMPOS PARA ATUALIZAR SÃO PERMITIDOS//

export const checkIfSomeFieldIsNotAllowed = (params, allowedFields) => {
    Object.keys(params).some((field) => !allowedFields.includes(field))
}
export const someFieldIsNotAllowedResponse = () =>
    badRequest({
        message: 'Some field provide is not allowed',
    })

//SE OS CAMPOS PARA ATUALIZAR ESTÃO EM BRANCO//

export const checkIfSomeFieldIsBlanck = (params) => {
    Object.keys(params).some(
        (field) =>
            typeof params[field] === 'string' &&
            params[field].trim().length === 0,
    )
}
export const someFieldIsBlankResponse = () =>
    badRequest({ message: 'Some provided field is blank' })
