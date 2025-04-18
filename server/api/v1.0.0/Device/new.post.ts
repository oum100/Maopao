import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import { Device, validateDevice } from "@/models/device";

const prisma = new PrismaClient();

export default defineEventHandler(async (event:H3Event) => {
    const body = await readBody(event);
    if(!body){
        throw createError({
            statusCode: 500,
            statusMessage: "Missing body",
        })        
    }


    const { error } = validateDevice(body);
    let result:string = ''

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.details[0].message,
        }) 
    }

    //if duplicate serialNumber
    const foundCode = await prisma.device.findUnique({
        where:{serialNumber:body.serialNumber}
    })
    if(foundCode){
        result = "Duplicate code. "
    }

    if(!result){
        const data = await prisma.device.create({
            data: {
                serialNumber: body.serialNumber as string,
                model: body.model as string,
                version: body.version as string,         
                languageId:1,
                unitId:0
            },
        });
        return { 
            status:200,
            description:"Create success",
            data:data 
        }
    }else{
        return {
            statusCode:500,
            statusMessage:result,
        };
    }

});
