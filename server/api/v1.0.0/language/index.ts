import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(() => {
  throw createError({
    statusCode: 400,
    message: 'Missing language code. Use /api/v1.0.0/language/:code',
  })
})
