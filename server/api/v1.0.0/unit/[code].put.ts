import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const code = parseInt(event.context.params!.code) 
    
    try{
        //Looking for a Unit with the given code
        const body = await readBody(event)
        const updated = await prisma.unit.update({
            where: { code },
            data: { name: body.name },
        })

        return {
            success: true,
            message: 'Update success',
            data: updated
        }
    }catch(e){       
        throw createError({
            statusCode: 404,
            statusMessage: `The Unit with given code: ${code} not found`,
        });      
    }
    
  })