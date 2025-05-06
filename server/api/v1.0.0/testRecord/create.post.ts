import { H3Event } from "h3";
import prisma from '~/lib/prisma';
import { TestRecord, validateTestRecord } from "@/models/testrecord";



export default defineEventHandler(async (event:H3Event) => {
    const body = await readBody(event);

    const { error } = validateTestRecord(body);
    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.details[0].message,
        }) 
    }

    const {serialNumber,macAddress} = body
    let deviceId = ''
    
    if(serialNumber){
      const device = await prisma.device.findUnique({
        where: { serialNumber },
      });

      if (!device) {
        throw createError({ statusCode: 404, statusMessage: "Device not found" });
      }
      
      deviceId = device.id
    }else if(macAddress){
      const device = await prisma.device.findUnique({
        where: {macAddress}
      })

      if (!device) {
        throw createError({ statusCode: 404, statusMessage: "Device not found" });
      }

      deviceId = device.id
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
              // connect: { serialNumber: serialNumber } // replace with an actual device serialNumber
              connect:{id: deviceId}
            }
          }        
    });
    return { 
        status:200,
        description:"Create success",
        data:data 
    }
});
