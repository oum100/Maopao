import { H3Event } from 'h3';
import { PrismaClient} from "@prisma/client";
import { Device}  from '@/models/device';

const prisma = new PrismaClient();

export default defineEventHandler( async(event:H3Event) => {
    const query = await getQuery(event)

    if(!query.serialNumber){
        throw createError({
            statusCode: 500,
            statusMessage: "Missing parameter",
        })  
    }
    console.log(query.serialNumber)
    const result = await prisma.device.findFirst({
        where: {
            serialNumber: String(query.serialNumber).toUpperCase()
        },
        include:{
            unit:{select: { code:true,name: true }},
            language:{select: { code:true, name: true }},
            testMode:{select: { code:true, name: true }}
        }
    })
    if(!result){
        throw createError({
            statusCode: 500,
            statusMessage: "Record Not Found",
        })  
    }

    return {
        status:200,
        description:"Read success",
        data:result
    }
})