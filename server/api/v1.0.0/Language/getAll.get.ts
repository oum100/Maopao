import { H3Event } from 'h3';
import { PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();

export default defineEventHandler( async(event: H3Event) => {
    const result = await prisma.language.findMany()
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