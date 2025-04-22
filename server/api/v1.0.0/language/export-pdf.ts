import prisma from '~/lib/prisma';
import PDFDocument from 'pdfkit'
import { PassThrough } from 'stream'

export default defineEventHandler(async (event) => {
  const doc = new PDFDocument({ margin: 30, size: 'A4' })
  const stream = new PassThrough()

  const filename = 'languages.pdf'
  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)

  // pipe PDF stream to response
  doc.pipe(stream)

  // heading
  doc.fontSize(20).text('Language List', { align: 'center' })
  doc.moveDown()

  // table header
  doc.fontSize(12).text('Code', 50, doc.y, { continued: true })
  doc.text('Name', 150, doc.y, { continued: true })
  doc.text('Created At', 300)

  doc.moveDown(0.5)
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()

  const items = await prisma.language.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // table rows
  items.forEach((item) => {
    doc.moveDown(0.5)
    doc.text(item.code.toString(), 50, doc.y, { continued: true })
    doc.text(item.name, 150, doc.y, { continued: true })
    doc.text(new Date(item.createdAt).toLocaleString(), 300)
  })

  doc.end()

  return stream
})
