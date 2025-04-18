import { H3Event } from 'h3';
import { PrismaClient} from "@prisma/client";
import { Unit}  from '@/models/unit';

const prisma = new PrismaClient();

export default defineEventHandler( async(event:H3Event) => {
    const query = await getQuery(event)

    if(!query.code){
        throw createError({
            statusCode: 500,
            statusMessage: "Missing parameter",
        })  
    }
    console.log(query.code)
    const result = await prisma.unit.findFirst({
        where: {
            code: Number(query.code)
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