import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import os from 'os'

const SMART_CONVERTER = path.join(process.cwd(), 'smart_converter.py')

function tempFilePath(ext: string): string {
  return path.join(os.tmpdir(), `fakelove_${Date.now()}.${ext}`)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('files') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const inputExt = file.name.split('.').pop()?.toLowerCase() || ''
    const validExt = ['pdf']

    if (!validExt.includes(inputExt)) {
      return NextResponse.json({ error: `Only PDF files supported for this conversion` }, { status: 400 })
    }

    const inputPath = tempFilePath(inputExt)
    fs.writeFileSync(inputPath, Buffer.from(await file.arrayBuffer()))

    try {
      return new Promise<NextResponse>((resolve) => {
        const proc = spawn('python', [SMART_CONVERTER, inputPath], {
          windowsHide: true
        })

        let stdout = '', stderr = ''

        proc.stdout.on('data', (data) => { stdout += data.toString() })
        proc.stderr.on('data', (data) => { stderr += data.toString() })

        proc.on('close', (code) => {
          try { fs.unlinkSync(inputPath) } catch {}

          console.log('Smart convert stdout:', stdout)
          console.log('Smart convert stderr:', stderr)

          if (code === 0 && stdout.includes('OK:')) {
            const outputPath = stdout.match(/OK:(.+)/)?.[1]?.trim()

            if (outputPath && fs.existsSync(outputPath)) {
              const outputBuffer = fs.readFileSync(outputPath)
              const filename = file.name.replace('.pdf', '.docx')

              try { fs.unlinkSync(outputPath) } catch {}

              resolve(new NextResponse(outputBuffer, {
                headers: {
                  'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  'Content-Disposition': `attachment; filename=${filename}`,
                },
              }))
            } else {
              resolve(NextResponse.json({ error: 'Output file not created' }, { status: 500 }))
            }
          } else {
            resolve(NextResponse.json({ error: stderr || stdout || 'Conversion failed' }, { status: 500 }))
          }
        })

        proc.on('error', (err) => {
          try { fs.unlinkSync(inputPath) } catch {}
          resolve(NextResponse.json({ error: 'Python error: ' + err.message }, { status: 500 }))
        })

        setTimeout(() => {
          try { proc.kill() } catch {}
          resolve(NextResponse.json({ error: 'Timeout' }, { status: 500 }))
        }, 60000)
      })
    } catch (e) {
      try { fs.unlinkSync(inputPath) } catch {}
      return NextResponse.json({ error: `${e}` }, { status: 500 })
    }
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}