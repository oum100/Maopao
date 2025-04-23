import { H3Event } from "h3";
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event:H3Event) => {
  const serialNumber = getRouterParam(event, 'serialNumber')
  const query = getQuery(event)

  // 🔢 Pagination
  const rawPage = parseInt(query.page as string)
  const rawLimit = parseInt(query.limit as string)
  const page = Math.max(rawPage || 1, 1)
  const limit = Math.min(rawLimit > 0 ? rawLimit : 10, 100)
  const skip = (page - 1) * limit

  // 🔁 Sorting
  const sort = (query.sort as string)?.trim() || 'dateTime:desc'
  const [sortField, sortOrderRaw] = sort.split(':')
  const sortOrder = sortOrderRaw?.toLowerCase() === 'asc' ? 'asc' : 'desc'

  // 🎯 Filters
  const min = parseFloat(query.min as string)
  const max = parseFloat(query.max as string)
  const startDate = query.startDate ? new Date(query.startDate as string) : undefined
  const endDate = query.endDate ? new Date(query.endDate as string) : undefined

  const filter: any = { serialNumber }

  // 📊 Alcohol Range Filter
  const alcoholFilter: Record<string, number> = {}
  if (!isNaN(min)) alcoholFilter.gte = min
  if (!isNaN(max)) alcoholFilter.lte = max
  if (Object.keys(alcoholFilter).length > 0) {
    filter.alcoholValue = alcoholFilter
  }

  // ⏱️ Date Range Filter
  if (startDate || endDate) {
    filter.dateTime = {}
    if (startDate) filter.dateTime.gte = startDate
    if (endDate) filter.dateTime.lte = endDate
  }

  // 📦 Device info
  const device = await prisma.device.findUnique({
    where: { serialNumber },
    include: {
      unit: true,
      language: true,
      testMode: true,
    },
  })

  // 📥 Count total
  const total = await prisma.testRecord.count({ where: filter })

  // 📄 Load records
  const records = await prisma.testRecord.findMany({
    where: filter,
    skip,
    take: limit,
    orderBy: { [sortField]: sortOrder },
    include: {
      unit: true,
    },
  })

  return {
    device,
    records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
})
