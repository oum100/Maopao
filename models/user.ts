import Joi from 'joi'

export interface User {
    uuid:string,
    email:string,
    password:string,
    appKey:string,
    appSecret:string,
    device:number
}