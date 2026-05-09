import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import os from 'os'

const PYTHON_SCRIPT = path.join(process.cwd(), 'pdf_to_office.py')

function tempFilePath(ext: string): string {
  return path.join(os.tmpdir(), `fakelove_${Date.now()}.${ext}`)
}

const MIME_TYPES: Record<string, string> = {
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('files') as File
    const outputFormat = (formData.get('format') as string) || 'docx'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const inputExt = file.name.split('.').pop()?.toLowerCase() || ''

    if (inputExt !== 'pdf') {
      return NextResponse.json({ error: 'Only PDF files supported' }, { status: 400 })
    }

    if (!['docx', 'xlsx', 'pptx'].includes(outputFormat)) {
      return NextResponse.json({ error: 'Invalid output format' }, { status: 400 })
    }

    const inputPath = tempFilePath(inputExt)
    fs.writeFileSync(inputPath, Buffer.from(await file.arrayBuffer()))

    try {
      return new Promise<NextResponse>((resolve) => {
        const proc = spawn('python', [PYTHON_SCRIPT, inputPath, outputFormat], {
          windowsHide: true
        })

        let stdout = '', stderr = ''

        proc.stdout.on('data', (data) => { stdout += data.toString() })
        proc.stderr.on('data', (data) => { stderr += data.toString() })

        proc.on('close', (code) => {
          try { fs.unlinkSync(inputPath) } catch {}

          if (code === 0 && stdout.includes('OK:')) {
            const outputPath = stdout.match(/OK:(.+)/)?.[1]?.trim()

            if (outputPath && fs.existsSync(outputPath)) {
              const outputBuffer = fs.readFileSync(outputPath)
              const filename = file.name.replace('.pdf', `.${outputFormat}`)

              try { fs.unlinkSync(outputPath) } catch {}

              resolve(new NextResponse(outputBuffer, {
                headers: {
                  'Content-Type': MIME_TYPES[outputFormat],
                  'Content-Disposition': `attachment; filename=${filename}`,
                },
              }))
            } else {
              resolve(NextResponse.json({ error: 'Output file not created' }, { status: 500 }))
            }
          } else {
            const errMsg = stderr || stdout || 'Conversion failed'
            resolve(NextResponse.json({ error: errMsg }, { status: 500 }))
          }
        })

        proc.on('error', (err) => {
          try { fs.unlinkSync(inputPath) } catch {}
          resolve(NextResponse.json({ error: 'Python error: ' + err.message }, { status: 500 }))
        })

        setTimeout(() => {
          try { proc.kill() } catch {}
          resolve(NextResponse.json({ error: 'Timeout' }, { status: 500 }))
        }, 120000)
      })
    } catch (e) {
      try { fs.unlinkSync(inputPath) } catch {}
      return NextResponse.json({ error: `${e}` }, { status: 500 })
    }
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}