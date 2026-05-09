import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const pagesParam = formData.getAll('pages') as string[]

    if (!files || files.length < 1) {
      return NextResponse.json(
        { error: 'Need at least 1 file to merge' },
        { status: 400 }
      )
    }

    const mergedPdf = await PDFDocument.create()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)

      let pageIndices: number[]

      if (pagesParam[i]) {
        const pageNums = pagesParam[i].split(',').map(Number)
        pageIndices = pageNums
          .filter((p) => p >= 1 && p <= pdf.getPageCount())
          .map((p) => p - 1)
      } else {
        pageIndices = pdf.getPageIndices()
      }

      if (pageIndices.length > 0) {
        const copiedPages = await mergedPdf.copyPages(pdf, pageIndices)
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }
    }

    const pdfBytes = await mergedPdf.save()
    const buffer = Buffer.from(pdfBytes)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=merged.pdf',
      },
    })
  } catch (error) {
    console.error('Merge error:', error)
    return NextResponse.json(
      { error: 'Failed to merge PDFs' },
      { status: 500 }
    )
  }
}