import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const code = parseInt(event.context.params!.code);

  const item = await prisma.unit.findUnique({
    where: { code },
    include:{
      _count:{
        select:{
          devices:true,
          records:true
        },
        
      }
    }
  });
  
  if (!item) {
    throw createError({
      statusCode: 404,
      statusMessage: `Unit with given code: ${code} not found`,
    });
  }

  if((item._count.devices != 0) && (item._count.records != 0)){
    throw createError({
      statusCode: 505,
      statusMessage: `Cannot delete this Unit code: ${code} are in used`,
    });    
  }
  // Deleting Unit
  const deleted = await prisma.unit.delete({
    where:{code}
  })

  return {
    success: true,
    message: "Delete success",
    data: deleted,
  };
});
