import Joi from 'joi'

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
        serialNumber: Joi.string().required(),
        model: Joi.string().required().default('H3'),
        version: Joi.string().required(),
        uuid: Joi.number().max(255),
        languageId: Joi.number().max(255).default(1),
        unitId: Joi.number().max(255).default(0),
        testModeId: Joi.number().max(255).default(1),
        records:Joi.array().items(Joi.number()),
    }).unknown(true)
    return schema.validate(body)
}