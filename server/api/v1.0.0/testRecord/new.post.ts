import { H3Event } from "h3";
import prisma from '~/lib/prisma';
import { TestRecord, validateTestRecord } from "@/models/testrecord";



export default defineEventHandler(async (event:H3Event) => {
    const query = await getQuery(event)
    const recordNumber = parseInt(String(query.recordNumber))

    const body = await readBody(event);
    if(!body){
        throw createError({
            statusCode: 500,
            statusMessage: "Missing body",
        })        
    }

    const { error } = validateTestRecord(body);
    let result:string = ''

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.details[0].message,
        }) 
    }

    const data = await prisma.testRecord.create({
        data: {
            recordNumber: body.recordNumber, // must be unique
            alcoholValue: parseFloat(body.alcoholValue),
            dateTime: new Date(String(body.dateTime)), // or a specific date: new Date("2025-04-18T14:00:00Z")
            unit: {
              connect: { code: parseInt(body.unitId) } // replace with your actual unitId
            },
            device: {
              connect: { serialNumber: body.serialNumber } // replace with an actual device serialNumber
            }
          }        
    });
    return { 
        status:200,
        description:"Create success",
        data:data 
    }
});
