import { H3Event } from 'h3';
import prisma from '@/lib/prisma'

export default defineEventHandler(async(event:H3Event) => {
    const email = event.context.params!.email

    const item = await prisma.user.findUnique({
        where: { email },
        include:{devices:{select:{serialNumber:true}}}
      });
    
      if (!item) {
        throw createError({
          statusCode: 404,
          statusMessage: `Unit with given code: ${email} not found`,
        });
      }
    
      // return { items, total }
      return {
        success: true,
        message: "Read success",
        data: item,
      };    
})