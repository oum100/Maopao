import Joi from "joi";

export interface TestRecord {
  recordNumber: number;
  alcoholValue: number;
  dateTime: Date;
  unitId: number;
  deviceSN: string;
}

export function validateTestRecord(body: any) {
  const schema = Joi.object({
    serialNumber: Joi.string().max(15).required(),
    recordNumber: Joi.number().required(),
    alcoholValue: Joi.number().required(),
    dateTime: Joi.date().required(),
    unitId: Joi.number().max(255).required(),
  }).unknown(true);
  return schema.validate(body);
}
