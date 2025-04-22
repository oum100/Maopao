import { validateLang } from '~/models/language'
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { error } = validateLang(body)
  if(error){
    throw createError({
      statusCode:400,
      statusMessage: "Invalid input data"
    })
  }

  const {code, name} = body

  const exists = await prisma.testMode.findUnique({ where: { code:parseInt(code)  } })
  if (exists) {
    throw createError({ statusCode: 400, statusMessage: 'TestMode code already exists' })
  }

  const item = await prisma.testMode.create({
    data: { code:parseInt(code), name },
  })

  // 🔁 Clear filter cache
  const cache = useStorage()
  await cache.removeItem('device_filters')  
  
  return item
})
