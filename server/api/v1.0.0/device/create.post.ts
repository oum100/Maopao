import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import { Device, validateDevice } from "@/models/device";

const prisma = new PrismaClient();

export default defineEventHandler(async (event:H3Event) => {
    const body = await readBody(event) || {}

    const { error } = validateDevice(body);
    let result:string = ''

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.details[0].message,
        }) 
    }

    //if looking for existing serialNumber
    const foundCode = await prisma.device.findUnique({
        where:{serialNumber:body.serialNumber}
    })
    if(foundCode){
        throw createError({
            statusCode: 400,
            statusMessage: "Device already exists"
        })
    }

    const created = await prisma.device.create({
        data: {
            serialNumber: body.serialNumber as string,
            model: body.model as string,
            version: body.version as string,         
            language:{
                connect:{ code: parseInt(body.language) }
            },
            unit: {
                connect: { code: parseInt(body.unit) } // replace with your actual unitId
            },
            testMode:{
                connect: {code: parseInt(body.testMode)}
            }
        },
    });

    // 🔁 Clear filter cache
    const cache = useStorage()
    await cache.removeItem('device_filters')

    return { 
        success: true,
        message:"Device created successfully",
        data:created 
    }


});
