import { defineEventHandler, getQuery } from 'h3'
import prisma from '~/server/utils/prisma'

const allowedSortFields = ['serialNumber', 'model', 'version', 'createdAt'] as const

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const rawPage = parseInt(query.page as string)
  const rawLimit = parseInt(query.limit as string)

  const page = Math.max(rawPage || 1, 1)
  const limit = Math.min(rawLimit > 0 ? rawLimit : 10, 100)

  const model = (query.model as string)?.trim()
  const version = (query.version as string)?.trim()

  const sortRaw = (query.sort as string)?.trim() || 'createdAt:desc'
  const [field, direction] = sortRaw.split(':')

  const sortField = allowedSortFields.includes(field as any) ? field : 'createdAt'
  const sortOrder = direction?.toLowerCase() === 'asc' ? 'asc' : 'desc'
  const orderBy = { [sortField]: sortOrder } as Record<string, 'asc' | 'desc'>

  // const sortField = sortBy.value[0]?.key || 'createdAt'
  // const sortOrder = sortBy.value[0]?.order === 'asc' ? 'asc' : 'desc'
  // const orderBy = { [sortField]: sortOrder } as Record<string, 'asc' | 'desc'>
  

  const where:any = {
    ...(model ? { model: { contains: model, mode: 'insensitive' } } : {}),
    ...(version ? { version: { contains: version, mode: 'insensitive' } } : {}),
    ...(query.unitId ? { unitId: parseInt(query.unitId as string) } : {}),
    ...(query.testModeId ? { testModeId: parseInt(query.testModeId as string) } : {}),
  }

//   if (model) where.model = { contains: model, mode: 'insensitive' }
//   if (version) where.version = { contains: version, mode: 'insensitive' }

  const total = await prisma.device.count({ where })
  const totalPages = Math.max(Math.ceil(total / limit), 1)
  const safePage = Math.min(page, totalPages)
  const skip = (safePage - 1) * limit

  const devices = await prisma.device.findMany({
    where,
    skip,
    take: limit,
    orderBy,
    include: {
      unit: true,
      language: true,
      testMode: true,
      records: { select: { id: true } },
    },
  })

  return {
    success: true,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
    data: devices,
  }
})
