import { TestRecord } from '@/models/testrecord';
import { H3Event } from "h3";
// import prisma from "@/server/utils/prisma";
import prisma from "~/lib/prisma"

//Starting main api finction here.
export default defineEventHandler(async (event: H3Event) => {
  const serialNumber = getRouterParam(event, "serialNumber");

  // 🔎 Step 1: ตรวจสอบว่า device นี้มีจริงหรือไม่
  const device = await prisma.device.findUnique({
    where: { serialNumber },
    include:{
      _count:{select:{records:true}}
    }
  });

  if (!device) {
    throw createError({ statusCode: 404, statusMessage: "Device not found" });
  }

  // 🔒 Step 2: ตรวจสอบว่ามี TestRecord หรือไม่
  if (device._count.records > 0 ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot delete device with test data",
    });
  }

  // 🗑 Step 3: ลบ device
  await prisma.device.delete({ where: { serialNumber } });

  return {
    success: true,
    message: "Delete success",
    data: device,
  };
});
