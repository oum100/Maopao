import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const code = parseInt(event.context.params!.code);

  const item = await prisma.testMode.findUnique({
    where: { code },
    include:{
      _count:{select:{devices:true}}
    }
  });
  
  if (!item) {
    throw createError({
      statusCode: 404,
      statusMessage: `TestMode with given code: ${code} not found`,
    });
  }

  if(item._count.devices != 0){
    throw createError({
      statusCode: 505,
      statusMessage: `Cannot delete this TestMode code: ${code} are in used`,
    });    
  }
  // Deleting TestMode
  const deleted = await prisma.testMode.delete({
    where:{code}
  })

  return {
    success: true,
    message: "Delete success",
    data: deleted,
  };
});
