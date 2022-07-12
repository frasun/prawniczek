import MESSAGES from '../messages/messages'

interface Validator {
    [key: string]: {
        pattern: RegExp
        message: string
    }
}

const validators: Validator = {
    regon: {
        pattern: /^\d{9}$/,
        message: MESSAGES.validations.regon,
    },
}

export default validators

export function validate(value: string, pattern: RegExp) {
    return pattern.test(value)
}
