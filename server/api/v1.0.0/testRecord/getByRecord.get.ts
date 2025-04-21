import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import { TestRecord, validateTestRecord } from "@/models/testrecord";

const prisma = new PrismaClient();

export default defineEventHandler(async(event:H3Event) => {
    const query = await getQuery(event)
    if(!query.record){
        throw createError({
            statusCode: 500,
            statusMessage: "Missing parameter",
        })  
    }    

    const result = await prisma.testRecord.findFirst({
        where:{
            recordNumber: parseInt(String(query.record))
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
        data:{result}
    }

})