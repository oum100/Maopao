import Joi from 'joi'

export interface User {
    uuid:string,
    email:string,
    password:string,
    appKey:string,
    appSecret:string,
    device:number
}

export function validateNewUser(body:any){
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
    return schema.validate(body)
}