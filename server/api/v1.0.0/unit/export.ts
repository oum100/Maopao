import prisma from '~/lib/prisma';
import { write } from 'xlsx'

export default defineEventHandler(async (event) => {
  const xlsx = await import('xlsx')
  const items = await prisma.unit.findMany()

  const worksheetData = items.map((item) => ({
    Code: item.code,
    Name: item.name,
    CreatedAt: item.createdAt.toLocaleString('th-TH'),
  }))

  const ws = xlsx.utils.json_to_sheet(worksheetData)
  const wb = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(wb, ws, 'Unit')

  const buffer = write(wb, { bookType: 'xlsx', type: 'buffer' })

  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setHeader(event, 'Content-Disposition', 'attachment; filename=unit.xlsx')
  return buffer
})
