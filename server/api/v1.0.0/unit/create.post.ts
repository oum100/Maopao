import { validateLang } from '~/models/language'
import prisma from '~/server/utils/prisma'

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

  const exists = await prisma.unit.findUnique({ where: { code:parseInt(code)  } })
  if (exists) {
    throw createError({ statusCode: 400, statusMessage: 'Unit code already exists' })
  }

  const item = await prisma.unit.create({
    data: { code:parseInt(code), name },
  })

  return item
})
