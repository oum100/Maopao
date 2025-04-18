import { H3Event } from 'h3';
import { PrismaClient,Prisma} from "@prisma/client";
import { TestMode,validateTestModeCode}  from '@/models/testmode';

const prisma = new PrismaClient();

export default defineEventHandler(async(event:H3Event) => {
    const query = await getQuery(event)
    
    if (!query.code) {
        throw createError({
            statusCode: 500,
            statusMessage: "Missing parameter."
        }) 
    }

    try{
        const result = await prisma.testMode.delete({
            where:{
                code: Number(query.code)
            }
        })
        return {
            status:200,
            description:"Delete success",
            data:result
        }
    }catch(e){
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2025'){
                console.log("Cause: ", e.message)
            }
        }
        throw e
    }
})