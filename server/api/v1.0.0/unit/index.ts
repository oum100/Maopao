

export default defineEventHandler(() => {
  throw createError({
    statusCode: 400,
    message: 'Missing unit code. Use /api/v1.0.0/unit/:code',
  })
})
