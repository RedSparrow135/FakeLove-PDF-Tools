import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const mode = formData.get('mode') as string
    const range = formData.get('range') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const pageCount = pdf.getPageCount()
    
    let newPdf = await PDFDocument.create()
    
    if (mode === 'single' || (mode === 'selection' && range && !range.includes(','))) {
      const pageNum = parseInt(range || formData.get('page') as string, 10)
      if (isNaN(pageNum) || pageNum < 1 || pageNum > pageCount) {
        return NextResponse.json(
          { error: `Invalid page number. PDF has ${pageCount} pages.` },
          { status: 400 }
        )
      }
      const [copiedPage] = await newPdf.copyPages(pdf, [pageNum - 1])
      newPdf.addPage(copiedPage)
    } 
    else if (mode === 'every') {
      const every = parseInt(formData.get('every') as string || '1', 10)
      const indices: number[] = []
      for (let i = 0; i < pageCount; i += every) {
        indices.push(i)
      }
      const copiedPages = await newPdf.copyPages(pdf, indices)
      copiedPages.forEach((page) => newPdf.addPage(page))
    }
    else if ((mode === 'range' || mode === 'selection') && range) {
      const pageNumbers = parsePageRange(range, pageCount)
      if (pageNumbers.length === 0) {
        return NextResponse.json(
          { error: 'No valid pages found in range.' },
          { status: 400 }
        )
      }
      const indices = pageNumbers.map(n => n - 1)
      const copiedPages = await newPdf.copyPages(pdf, indices)
      copiedPages.forEach((page) => newPdf.addPage(page))
    } 
    else {
      return NextResponse.json(
        { error: 'Please specify a page number or range.' },
        { status: 400 }
      )
    }
    
    const pdfBytes = await newPdf.save()
    const buffer = Buffer.from(pdfBytes)
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=split.pdf',
      },
    })
  } catch (error) {
    console.error('Split error:', error)
    return NextResponse.json(
      { error: 'Failed to split PDF' },
      { status: 500 }
    )
  }
}

function parsePageRange(range: string, maxPages: number): number[] {
  const pages: number[] = []
  const parts = range.split(',')
  
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(n => parseInt(n, 10))
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= Math.min(end, maxPages); i++) {
          if (i >= 1 && !pages.includes(i)) pages.push(i)
        }
      }
    } else {
      const pageNum = parseInt(trimmed, 10)
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages && !pages.includes(pageNum)) {
        pages.push(pageNum)
      }
    }
  }
  
  return pages.sort((a, b) => a - b)
}