import Joi from 'joi'


export interface Language {
    code: number,
    name: string,
}

export function validateLang (body:any) {
    const schema = Joi.object({
        code: Joi.number().max(255).min(0).required(),
        name: Joi.string().max(50).required()
    })
    return schema.validate(body)
}

export function validateLangCode (body:any) {
    const schema = Joi.object({
        code: Joi.number().max(255).required(),
    })
    return schema.validate(body)
}

export function validateLangName (body:any) {
    const schema = Joi.object({
        name: Joi.string().max(15).required()
    })
    return schema.validate(body)
}
