import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const rawPage = parseInt(query.page as string)
  const rawLimit = parseInt(query.limit as string)
  const page = Math.max(rawPage || 1, 1)
  const limit = Math.min(rawLimit > 0 ? rawLimit : 10, 100)


  const name = (query.name as string)?.trim() || ''
  const where:any = name ? { name: { contains: name, mode: 'insensitive' } } : {}

  const allowedSortFields = ['code', 'name', 'createdAt'] // ปรับตามจริง
  const sortRaw = (query.sort as string)?.trim() || 'createdAt'
  const directionRaw = (query.order as string)?.trim()?.toLowerCase() === 'asc' ? 'asc' : 'desc'
  const sortField = allowedSortFields.includes(sortRaw) ? sortRaw : 'createdAt'
  const orderBy = { [sortField]: directionRaw } as Record<string, 'asc' | 'desc'>

  const totalCount = await prisma.unit.count({ where })
  const totalPages = Math.max(Math.ceil(totalCount / limit), 1)
  const safePage = Math.min(page, totalPages)
  const skip = (safePage - 1) * limit

  const [items, total] = await prisma.$transaction([
    prisma.unit.findMany({
      where,
      orderBy,
      skip,
      take:limit,
      include:{
        _count:{select:{devices:true}}
      }
      
    }),
    prisma.unit.count({ where }),
  ])

  // return { items, total }
  return {
    success: true,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
    data: items,
  }
})
