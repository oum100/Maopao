// server/middleware/requireParam.ts
import { defineEventHandler, getRouterParam, createError } from 'h3'

export function requireParam(paramName: string) {
  return defineEventHandler((event) => {
    const value = getRouterParam(event, paramName)

    if (typeof value !== 'string' || value.trim().length === 0) {
      throw createError({
        statusCode: 400,
        message: `Missing or invalid '${paramName}' in URL`,
      })
    }

    // ✅ เก็บค่าใน context โดยใช้ชื่อ param เป็น key
    event.context[paramName] = value.trim()
  })
}
