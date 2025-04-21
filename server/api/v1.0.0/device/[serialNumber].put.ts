import { H3Event } from "h3";
import { PrismaClient } from "@prisma/client";
import { validateDeviceUpdate } from "@/models/device";
import { requireParam } from "~/server/utils/requireParam"

// ✅ ใช้ middleware ตรวจ param 'serialNumber'
const validateSerialNumber = requireParam('serialNumber')

//Creating prisma client instance
const prisma = new PrismaClient();

//Starting main api finction here.
export default defineEventHandler(async (event: H3Event) => {
  validateSerialNumber(event)
  const serialNumber = event.context.serialNumber as string;

  // 🧠 ตรวจสอบว่ามี device ที่ใช้ serialNumber นี้หรือไม่
  const existingDevice = await prisma.device.findUnique({where: { serialNumber },})
  if (!existingDevice) {
    throw createError({ 
      statusCode: 404, 
      message: `Device with serial number '${serialNumber}' not found` })
  }

  //Getting body
  const body = await readBody(event) || {}
  //Using Joi validate data.
  const {error,value} = validateDeviceUpdate(body)
  if (error) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input data',
      data: error.details[0].message
    })
  }

  const updatedDevice = await prisma.device.update({
    where: {serialNumber},
    data:value
  }) 


  //Common return value
  return {
    success:true,
    message:"Update success",
    data:{updatedDevice}
  }

});
