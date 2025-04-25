import Joi from 'joi'

export interface User {
    uuid:string,
    name:string,
    email:string,
    password:string,
    provider:string,
    appKey:string,
    appSecret:string,
    profile:string
    device:number
}

export function validateNewUser(body:any){
    const schema = Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().max(30),
        password: Joi.string().required()
    }).unknown(true)
    return schema.validate(body)
}

export function validateLogin(body:any){
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
    return schema.validate(body)
}

export async function validateRegister(body:any){
    const schema = Joi.object({
        name:Joi.string().min(1).max(30),
        email:Joi.string().email().required(),
        password:Joi.string().required()
    }).unknown(true)
    return schema.validate(body)
}