import { H3Event } from 'h3';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event:H3Event) => {
  const code = parseInt(event.context.params!.code);

  const item = await prisma.testMode.findUnique({
    where: { code },
    include:{devices:{select:{serialNumber:true}}}
  });

  if (!item) {
    throw createError({
      statusCode: 404,
      statusMessage: `TestMode with given code: ${code} not found`,
    });
  }

  // return { items, total }
  return {
    success: true,
    message: "Read success",
    data: item,
  };
});
