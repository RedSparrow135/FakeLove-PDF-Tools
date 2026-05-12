import { NextRequest, NextResponse } from 'next/server'
import mammoth from 'mammoth'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const MAX_SIZE = 4.5 * 1024 * 1024 // 4.5MB Vercel limit

export async function POST(request: NextRequest) {
  let tempBuffer: ArrayBuffer | null = null
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided 💔' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 4.5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB` },
        { status: 413 }
      )
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!['docx', 'doc'].includes(ext)) {
      return NextResponse.json({ error: 'Only DOCX files supported' }, { status: 400 })
    }

    tempBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(tempBuffer)

    let result
    try {
      result = await mammoth.extractRawText({ buffer })
    } catch (mammothErr: any) {
      console.error('Mammoth error:', mammothErr)
      return NextResponse.json(
        { error: 'Cannot read this file. Please use .docx format only (not .doc binary)' },
        { status: 400 }
      )
    }
    
    let text = result.value
    if (!text || text.trim().length === 0) {
      text = '(Empty document)'
    }

    const pdfDoc = await PDFDocument.create()
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    const fontSize = 11
    const lineHeight = 14
    const pageHeight = 792
    const pageWidth = 612
    const margin = 50
    const maxWidth = pageWidth - margin * 2

    const lines: string[] = []
    const paragraphs = text.split(/\n\n+/)

    for (const para of paragraphs) {
      const words = para.split(/\s+/)
      let currentLine = ''

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const testWidth = timesRoman.widthOfTextAtSize(testLine, fontSize)

        if (testWidth > maxWidth && currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      if (currentLine) lines.push(currentLine)
      lines.push('')
    }

    let y = pageHeight - margin
    let page = pdfDoc.addPage([pageWidth, pageHeight])

    for (const line of lines) {
      if (y < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight])
        y = pageHeight - margin
      }

      if (line === '') {
        y -= lineHeight * 0.5
      } else {
        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font: timesRoman,
          color: rgb(0, 0, 0),
        })
        y -= lineHeight
      }
    }

    const pdfBytes: Uint8Array = await pdfDoc.save()
    const pdfBuffer = Buffer.from(pdfBytes.buffer, pdfBytes.byteOffset, pdfBytes.byteLength)

    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${file.name.replace(/\.[^.]+$/, '.pdf')}`,
      },
    })
  } catch (error: any) {
    console.error('Word to PDF conversion error:', error)
    const message = error?.message || 'Conversion failed'
    return NextResponse.json(
      { error: `Oops! ${message.slice(0, 100)} 💔` },
      { status: 500 }
    )
  }
}
