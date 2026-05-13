import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

const MAX_SIZE = 4.5 * 1024 * 1024 // 4.5MB Vercel limit

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

    const totalSize = files.reduce((acc, f) => acc + f.size, 0)
    if (totalSize > MAX_SIZE) {
      return NextResponse.json(
        { error: 'El tamaño total excede 4.5MB. Versión demo de Vercel.' },
        { status: 413 }
      )
    }

    const oversized = files.filter(f => f.size > MAX_SIZE)
    if (oversized.length > 0) {
      return NextResponse.json(
        { error: `Archivos muy grandes: ${oversized.map(f => f.name).join(', ')}` },
        { status: 413 }
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