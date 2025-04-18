import { H3Event } from 'h3';
import { PrismaClient,Prisma} from "@prisma/client";
import { Language, validateLangCode}  from '@/models/language';

const prisma = new PrismaClient();

export default defineEventHandler(async(event:H3Event) => {
    const body = await readBody(event)
    const {error} = validateLangCode(body)
    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.details[0].message,
        }) 
    }

    try{
        const result = await prisma.language.delete({
            where:{code:Number(body.code)}
        })
        return {
            status:200,
            description:"Delete success",
            data:result
        }
    }catch(e){
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            // if (e.code === 'P2002') {
            //   console.log(
            //     'There is a unique constraint violation, a new user cannot be created with this email'
            //   )
            // }

            if (e.code === 'P2025'){
                console.log("Cause: ", e.message)
            }
        }
        // if (e instanceof Error) {
        //     // throw e.message;
        // }
        throw e
    }
})