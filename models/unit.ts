import Joi from 'joi'

export interface Unit{
    code: number,
    name: string
}

export function validateUnit(body:any){
    const schema = Joi.object({
        code: Joi.number().max(255).required(),
        name: Joi.string().max(15).required()
    })
    return schema.validate(body)
}

export function validateUnitCode(body:any){
    const schema = Joi.object({
        code: Joi.number().max(255).required()
    })
    return schema.validate(body)
}

export function validateUnitName(body:any){
    const schema = Joi.object({
        name: Joi.string().max(15).required()
    })
    return schema.validate(body)
}