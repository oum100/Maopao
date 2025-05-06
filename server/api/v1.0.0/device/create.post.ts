import { H3Event } from "h3";
import prisma from '~/lib/prisma';
import { Device, validateDevice } from "@/models/device";

export default defineEventHandler(async (event: H3Event) => {
  const body = (await readBody(event)) || {};

  const { error } = validateDevice(body);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Invalid input data",
    });
  }

  //if looking for existing serialNumber

  const foundCode = await prisma.device.findUnique({
    where: { serialNumber: body.serialNumber },
  });

  if (foundCode) {
    throw createError({
      statusCode: 400,
      statusMessage: "Device already exists",
    });
  }
  console.log("Found Code", foundCode);

  const created = await prisma.device.create({
    data: {
      serialNumber: body.serialNumber as string,
      macAddress: body.macAddress as string,
      model: body.model as string || '',
      version: body.version as string || '',
      status: body.status || 'INSTOCK',
      language: {
        connect: { code: parseInt(body.language) },
      },
      unit: {
        connect: { code: parseInt(body.unit) }, // replace with your actual unitId
      },
      testMode: {
        connect: { code: parseInt(body.testMode) },
      },
    },
  });

  // 🔁 Clear filter cache
  const cache = useStorage();
  await cache.removeItem("device_filters");

  return {
    success: true,
    message: "Device created successfully",
    data: created,
  };
});
