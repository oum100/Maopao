import { H3Event } from 'h3';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event:H3Event) => {
    const email = event.context.params!.email

    const item = await prisma.user.findUnique({
        where:{email:email},
        include:{
            _count:{
              select:{
                devices:true,
              },
            }
          }
    })
   
    if (!item) {
        throw createError({
          statusCode: 404,
          statusMessage: `Unit with given code: ${email} not found`,
        });
      }
    
      if((item._count.devices != 0)){
        throw createError({
          statusCode: 505,
          statusMessage: `Cannot delete this Unit code: ${email} are in used`,
        });    
      }
      // Deleting Unit
      const deleted = await prisma.user.delete({
        where:{email}
      })
    
      return {
        success: true,
        message: "Delete success",
        data: deleted,
      };    
})