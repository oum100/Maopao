import { H3Event } from "h3";
import { PrismaClient, Prisma } from "@prisma/client";
import { TestMode, validateTestMode } from "@/models/testmode";

const prisma = new PrismaClient();

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  if (!body) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing body",
    });
  }
  const { error } = validateTestMode(body);
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.details[0].message,
    });
  }

  try {
    const result = await prisma.testMode.update({
      where: {
        code: Number(body.code),
      },
      data: {
        name: body.name,
      },
    });

    return {
      status: 200,
      description: "Update success",
      data: result,
    };
  } catch (e) {
    throw e;
  }
});
