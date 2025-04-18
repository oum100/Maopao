import Joi from 'joi'

export interface TestRecord {
    recordNumber: number,
    alcoholValue: number,
    dateTime: Date,
    unitId: number,
    deviceId: number
}

