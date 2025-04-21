import prisma from '@/server/utils/prisma'

export default defineEventHandler(async () => {
  const cache = useStorage() // Nitro storage instance
  const cacheKey = 'device_filters'
  const cacheTTL = 60 * 5 // 5 minutes

  // 🔍 ลองใช้ cache ก่อน
  const cached = await cache.getItem(cacheKey)
  if (cached) return cached

  // 🧠 ดึงข้อมูลจาก DB
  const [models, versions, units, testModes] = await Promise.all([
    prisma.device.findMany({
      distinct: ['model'],
      where: { model: { not: undefined } },
      select: { model: true },
      orderBy: { model: 'asc' },
    }),
    prisma.device.findMany({
      distinct: ['version'],
      where: { version: { not: undefined } },
      select: { version: true },
      orderBy: { version: 'asc' },
    }),
    prisma.unit.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    prisma.testMode.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
  ])

  const result = {
    models: models.map(m => m.model),
    versions: versions.map(v => v.version),
    units,
    testModes,
  }

  // 💾 เก็บ cache
  await cache.setItem(cacheKey, result, { ttl: cacheTTL })

  return result
})
