import { PrismaClient } from '@prisma/client'
import formidable from 'formidable'
import fs from 'fs/promises'
import xlsx from 'xlsx'
import { parse } from 'csv-parse/sync'
import prisma from '~/lib/prisma'

export const config = {
  api: {
    bodyParser: false
  }
}

export default defineEventHandler(async (event) => {
  const form = formidable({ keepExtensions: true })

  const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })

  const file = (files.file as any)?.[0]
  if (!file) throw createError({ statusCode: 400, statusMessage: 'File not uploaded' })

  const buffer = await fs.readFile(file.filepath)
  const ext = file.originalFilename.split('.').pop()?.toLowerCase()

  let records: any[] = []

  if (ext === 'xlsx' || ext === 'xls') {
    const workbook = xlsx.read(buffer)
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    records = xlsx.utils.sheet_to_json(sheet)
  } else if (ext === 'csv') {
    const content = buffer.toString()
    records = parse(content, { columns: true, skip_empty_lines: true })
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported file type' })
  }

  const devicesToInsert = records.map((r) => ({
    serialNumber: r.serialNumber?.trim(),
    macAddress: r.macAddress?.trim(),
    model: r.model?.trim(),
    version: r.version?.trim(),
    languageId: Number(r.languageId ?? 1),
    unitId: Number(r.unitId ?? 0),
    testModeId: Number(r.testModeId ?? 1),
    status: r.status?.toUpperCase() ?? 'INSTOCK',
  }))

  const inserted = await prisma.device.createMany({
    data: devicesToInsert,
    skipDuplicates: true,
  })

  return { success: true, count: inserted.count }
})
