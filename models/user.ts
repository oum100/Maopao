import Joi from 'joi'

export interface User {
    uuid:string,
    name:string,
    email:string,
    password:string,
    appKey:string,
    appSecret:string,
    profile:string
    device:number
}

export function validateNewUser(body:any){
    const schema = Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().max(30).required(),
        password: Joi.string().required()
    })
    return schema.validate(body)
}

export function validateLogin(body:any){
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
    return schema.validate(body)
}

export function validateRegister(body:any){
    const schema = Joi.object({
        name:Joi.string().min(1).max(30).required(),
        email:Joi.string().email().required(),
        password:Joi.string().pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).required()
    })
    return schema.validate(body)
}