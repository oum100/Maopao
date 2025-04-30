import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
    const email = event.context.params!.email
    
    try{
        //Looking for a Unit with the given code
        const body = await readBody(event)
        const updated = await prisma.user.update({
            where: { email },
            data: { name: body.name },
        })

        // 🔁 Clear filter cache
        // const cache = useStorage()
        // await cache.removeItem('device_filters')

        return {
            success: true,
            message: 'Update success',
            data: updated
        }
    }catch(e){       
        throw createError({
            statusCode: 404,
            statusMessage: `The Unit with given code: ${email} not found`,
        });      
    }
    
  })