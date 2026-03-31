import { badRequest, notFound } from './http.js'
import validator from 'validator'

export const userNotFoundResponse = () =>
    notFound({ message: 'User nout found' })

export const invalidPasswordResponse = () =>
    badRequest({
        message: 'Password must be a least 6 characters.',
    })

export const invalidEmailResponse = () =>
    badRequest({ message: 'Invalid Email' })

export const checkIfPasswordIsValid = (password) => password.length >= 6

export const checkIfEmailIsValid = (email) => validator.isEmail(email)
