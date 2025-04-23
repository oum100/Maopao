import { H3Event } from 'h3';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event:H3Event) => {
    const code = parseInt(event.context.params!.code) 
    
    try{
        //Looking for a language with the given code
        const body = await readBody(event)
        const updated = await prisma.language.update({
            where: { code },
            data: { name: body.name },
        })

        // 🔁 Clear filter cache
        const cache = useStorage()
        await cache.removeItem('device_filters')

        return {
            success: true,
            message: 'Update success',
            data: updated
        }
    }catch(e){       
        throw createError({
            statusCode: 404,
            statusMessage: `The language with given code: ${code} not found`,
        });      
    }
    
  })