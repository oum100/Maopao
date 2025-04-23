import { H3Event } from 'h3';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event:H3Event) => {
  const code = parseInt(event.context.params!.code);

  const item = await prisma.language.findUnique({
    where: { code },
    include:{
      _count:{select:{devices:true}}
    }
  });
  
  if (!item) {
    throw createError({
      statusCode: 404,
      statusMessage: `Language with given code: ${code} not found`,
    });
  }

  if(item._count.devices != 0){
    throw createError({
      statusCode: 505,
      statusMessage: `Cannot delete this language code: ${code} are in used`,
    });    
  }
  // Deleting language
  const deleted = await prisma.language.delete({
    where:{code}
  })

  return {
    success: true,
    message: "Delete success",
    data: deleted,
  };
});
