import { NextRequest, NextResponse } from 'next/server'
import docx from '@nativedocuments/docx-wasm'

const MAX_SIZE = 4.5 * 1024 * 1024

async function initDocx() {
  await docx.init({
    ENVIRONMENT: 'NODE',
    ND_DEV_ID: process.env.ND_DEV_ID || '',
    ND_DEV_SECRET: process.env.ND_DEV_SECRET || '',
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
    if (!['docx', 'doc'].includes(ext)) {
      return NextResponse.json({ error: 'Only DOCX files supported' }, { status: 400 })
    }

    await initDocx()

    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    const engine = await docx.engine()
    await engine.load(uint8Array)
    const pdfBuffer = await engine.exportPDF()
    await engine.close()

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
