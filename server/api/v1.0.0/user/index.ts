

export default defineEventHandler(() => {
  throw createError({
    statusCode: 400,
    message: 'Missing user. Usage /api/v1.0.0/user/:uuid',
  })
})
