import { NextRequest, NextResponse } from 'next/server'
import mammoth from 'mammoth'
import PDFDocument from 'pdfkit'

const MAX_SIZE = 4.5 * 1024 * 1024

interface Style {
  bold: boolean
  italic: boolean
  underline: boolean
  fontSize: number
  color: string
}

function cleanHtmlText(html: string): Array<{ text: string; style: Style }> {
  const fontSize = 11
  const segments: Array<{ text: string; style: Style }> = []
  const currentStyle: Style = { bold: false, italic: false, underline: false, fontSize, color: '#000000' }

  const cleanHtml = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<h[1-6][^>]*>/gi, '')
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
    .replace(/&[a-z]+;/gi, '')
    .replace(/İ/g, 'I').replace(/ı/g, 'i')
    .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
    .replace(/Ü/g, 'U').replace(/ü/g, 'u')
    .replace(/Ş/g, 'S').replace(/ş/g, 's')
    .replace(/Ö/g, 'O').replace(/ö/g, 'o')
    .replace(/Ç/g, 'C').replace(/ç/g, 'c')
    .replace(/[^\x00-\x7F]/g, '?')

  const lines = cleanHtml.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed) {
      segments.push({ text: trimmed, style: { ...currentStyle } })
    } else {
      segments.push({ text: '\n', style: { ...currentStyle } })
    }
  }
  return segments
}

async function generatePdfFromHtml(html: string): Promise<Buffer> {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 72, bottom: 72, left: 72, right: 72 },
    bufferPages: true,
  })

  const chunks: Buffer[] = []
  doc.on('data', (chunk: Buffer) => chunks.push(chunk))

  const fontSize = 11
  const lineHeight = 16
  const pageHeight = doc.page.height
  const marginLeft = 72
  const marginRight = 72
  const maxWidth = doc.page.width - marginLeft - marginRight
  let y = pageHeight - 100

  doc.font('Helvetica').fontSize(fontSize)

  const segments = cleanHtmlText(html)
  let page = doc as any

  for (const seg of segments) {
    if (seg.text === '\n') {
      y -= lineHeight * 0.8
      if (y < 100) {
        doc.addPage()
        y = pageHeight - 100
      }
      continue
    }

    const text = seg.text
    const words = text.split(' ')
    let line = ''

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word
      const testWidth = doc.widthOfString(testLine)

      if (testWidth > maxWidth && line) {
        if (y < 100) {
          doc.addPage()
          y = pageHeight - 100
        }
        page.drawText(line, { x: marginLeft, y, width: maxWidth })
        y -= lineHeight
        line = word
      } else {
        line = testLine
      }
    }

    if (line) {
      if (y < 100) {
        doc.addPage()
        y = pageHeight - 100
      }
      page.drawText(line, { x: marginLeft, y, width: maxWidth })
      y -= lineHeight
    }
  }

  doc.end()

  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
  })
}

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

    const result = await mammoth.convertToHtml({ buffer })
    const html = result.value

    if (!html || html.trim().length === 0) {
      return NextResponse.json(
        { error: 'Cannot read this file. Is it a valid DOCX?' },
        { status: 400 }
      )
    }

    const pdfBuffer = await generatePdfFromHtml(html)

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
