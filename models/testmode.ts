import Joi from 'joi'

export interface TestMode{
    code: number,
    name: string
}

export function validateTestMode(body:any){
    const schema = Joi.object({
        code: Joi.number().max(255).required(),
        name: Joi.string().max(15).required()
    })
    return schema.validate(body)
}

export function validateTestModeCode(body:any){
    const schema = Joi.object({
        code: Joi.number().max(255).required()
    })
    return schema.validate(body)
}

export function validateTestModeName(body:any){
    const schema = Joi.object({
        name: Joi.string().max(15).required()
    })
    return schema.validate(body)
}