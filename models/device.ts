import Joi from 'joi'
import {z} from 'zod'

export interface Device {
    serialNumber: string,
    model: string,
    version: string,
    uuid: string,
    languageId: number,
    unitId: number,
    testModeId: number,
    records: number[]
}

export function validateDevice(body:any) {
    const schema = Joi.object({
        serialNumber: Joi.string(),
        macAddress: Joi.string(),
        model: Joi.string().required().default('H3'),
        version: Joi.string().required(),
        uuid: Joi.number().max(255),
        language: Joi.number().max(255).default(1),
        unit: Joi.number().max(255).default(0),
        testMode: Joi.number().max(255).default(1),
        records:Joi.array().items(Joi.number()),
    })
    .or('serialNumber', 'macAddress')
    .unknown(true)
    return schema.validate(body)
}

export function validateDeviceRegister(body:any) {
    const schema = Joi.object({
        serialNumber: Joi.string(),
        macAddress: Joi.string(),
        userUuid: Joi.string().required()
    })
    .xor('serialNumber', 'macAddress')
    .unknown(true)
    return schema.validate(body)
}

export function validateDeviceUpdate(body:any){
    const schema = Joi.object({
        model: Joi.string().optional(),
        version:Joi.string().optional(),
        unitId: Joi.number().optional(),
        languageId: Joi.number().optional(),
        testModeId: Joi.number().optional()
    }).min(1)
    return schema.validate(body)
}


export function validateUpdateDevice(body:any){
    const schema = z.object({
        model: z.string().optional(),
        version: z.string().optional(),
        unitId: z.number().optional(),
        languageId: z.number().optional(),
        testModeId: z.number().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided.",
    });

    return schema.safeParse(body)
}