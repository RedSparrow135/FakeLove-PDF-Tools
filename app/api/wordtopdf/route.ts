import { NextRequest, NextResponse } from 'next/server'
import mammoth from 'mammoth'

const MAX_SIZE = 4.5 * 1024 * 1024

async function generatePdf(html: string): Promise<Buffer> {
  const pdfMakeModule = await import('pdfmake/build/pdfmake.min.js')
  const pdfMake: any = pdfMakeModule.default || pdfMakeModule

  const content: any[] = []

  const cleanHtml = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<h[1-6][^>]*>/gi, '')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    .replace(/<ul[^>]*>/gi, '').replace(/<\/ul>/gi, '')
    .replace(/<ol[^>]*>/gi, '').replace(/<\/ol>/gi, '')
    .replace(/<b>/gi, '**').replace(/<\/b>/gi, '**')
    .replace(/<strong>/gi, '**').replace(/<\/strong>/gi, '**')
    .replace(/<i>/gi, '*').replace(/<\/i>/gi, '*')
    .replace(/<em>/gi, '*').replace(/<\/em>/gi, '*')
    .replace(/<u>/gi, '').replace(/<\/u>/gi, '')
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

  const paragraphs = cleanHtml.split(/\n\n+/)

  for (const para of paragraphs) {
    const trimmed = para.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('• ')) {
      const items = trimmed.split('\n').filter(t => t.startsWith('• '))
      if (items.length > 0) {
        content.push({
          ul: items.map(t => ({ text: t.replace('• ', ''), margin: [0, 2, 0, 2] }))
        })
        continue
      }
    }

    const isBold = trimmed.startsWith('**') && trimmed.endsWith('**')
    const isItalic = /^\*.*\*$/.test(trimmed) && !isBold
    const cleanText = trimmed.replace(/^\*\*|\*\*$/g, '').replace(/^\*|\*$/g, '')

    if (cleanText) {
      content.push({
        text: cleanText,
        margin: [0, 0, 0, 8],
        bold: isBold,
        italics: isItalic,
        fontSize: 11,
        lineHeight: 1.3,
      })
    }
  }

  if (content.length === 0) {
    content.push({ text: '(Empty document)', fontSize: 11, color: '#666' })
  }

  return new Promise((resolve, reject) => {
    try {
      const docDefinition = {
        content,
        defaultStyle: {
          font: 'Roboto',
          fontSize: 11,
        },
        pageSize: 'A4',
        pageMargins: [60, 60, 60, 60],
      }

      const pdfDoc = pdfMake.createPdf(docDefinition)

      pdfDoc.getBuffer((buffer: Buffer) => {
        resolve(Buffer.from(buffer))
      })
    } catch (err) {
      reject(err)
    }
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

    const pdfBuffer = await generatePdf(html)

    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${file.name.replace(/\.[^.]+$/, '.pdf')}`,
      },
    })
  } catch (error: any) {
    console.error('Word to PDF error:', error)
    const message = error?.message || error?.toString() || 'Unknown error'
    return NextResponse.json(
      { error: `Conversion failed: ${message.slice(0, 200)}` },
      { status: 500 }
    )
  }
}
