import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const code = parseInt(event.context.params!.code);

  const item = await prisma.language.findUnique({
    where: { code },
    include:{devices:{select:{serialNumber:true}}}
  });

  if (!item) {
    throw createError({
      statusCode: 404,
      statusMessage: `Language with given code: ${code} not found`,
    });
  }

  // return { items, total }
  return {
    success: true,
    message: "Read success",
    data: item,
  };
});
