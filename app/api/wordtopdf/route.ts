import { NextRequest, NextResponse } from 'next/server'
import mammoth from 'mammoth'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const MAX_SIZE = 4.5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided 💔' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 4.5MB` },
        { status: 413 }
      )
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!['docx'].includes(ext)) {
      return NextResponse.json({ error: 'Only .docx files supported' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await mammoth.extractRawText({ buffer })
    let text = result.value

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Cannot read this file. Is it a valid DOCX?' },
        { status: 400 }
      )
    }

    text = text
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<h[1-6][^>]*>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<\/li>/gi, '\n')
      .replace(/<b>/gi, '').replace(/<\/b>/gi, '')
      .replace(/<strong>/gi, '').replace(/<\/strong>/gi, '')
      .replace(/<i>/gi, '').replace(/<\/i>/gi, '')
      .replace(/<em>/gi, '').replace(/<\/em>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/İ/g, 'I').replace(/ı/g, 'i')
      .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
      .replace(/Ü/g, 'U').replace(/ü/g, 'u')
      .replace(/Ş/g, 'S').replace(/ş/g, 's')
      .replace(/Ö/g, 'O').replace(/ö/g, 'o')
      .replace(/Ç/g, 'C').replace(/ç/g, 'c')
      .replace(/[^\x00-\x7F]/g, '?')

    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const fontSize = 11
    const lineHeight = 14
    const pageHeight = 792
    const pageWidth = 612
    const marginLeft = 50
    const marginRight = 50
    const maxWidth = pageWidth - marginLeft - marginRight
    const maxY = pageHeight - marginLeft
    const minY = marginRight

    const paragraphs = text.split(/\n\n+/)
    const lines: string[] = []

    for (const para of paragraphs) {
      const words = para.split(/\s+/)
      let currentLine = ''

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const testWidth = font.widthOfTextAtSize(testLine, fontSize)

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

    let y = maxY
    let page = pdfDoc.addPage([pageWidth, pageHeight])

    for (const line of lines) {
      if (line === '') {
        y -= lineHeight * 0.5
        continue
      }

      if (y - lineHeight < minY) {
        page = pdfDoc.addPage([pageWidth, pageHeight])
        y = maxY
      }

      page.drawText(line, {
        x: marginLeft,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      })
      y -= lineHeight
    }

    const pdfBytes = await pdfDoc.save()
    const pdfBuffer = Buffer.from(pdfBytes.buffer, pdfBytes.byteOffset, pdfBytes.byteLength)

    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${file.name.replace(/\.[^.]+$/, '.pdf')}`,
      },
    })
  } catch (error: any) {
    console.error('Word to PDF error:', error)
    return NextResponse.json(
      { error: `Conversion failed: ${error?.message?.slice(0, 100) || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
