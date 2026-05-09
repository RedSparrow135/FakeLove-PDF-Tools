import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import os from 'os'

const COMPRESS_SCRIPT = path.join(process.cwd(), 'compress.py')

function tempFilePath(ext: string): string {
  return path.join(os.tmpdir(), `fakelove_${Date.now()}.${ext}`)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const level = (formData.get('level') as string) || 'medium'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const inputPath = tempFilePath('pdf')
    fs.writeFileSync(inputPath, Buffer.from(await file.arrayBuffer()))

    const outputPath = tempFilePath('compressed.pdf')

    try {
      return new Promise<NextResponse>((resolve) => {
        const proc = spawn('python', [COMPRESS_SCRIPT, inputPath, outputPath, level], {
          windowsHide: true
        })

        let stdout = '', stderr = ''

        proc.stdout.on('data', (data) => { stdout += data.toString() })
        proc.stderr.on('data', (data) => { stderr += data.toString() })

        proc.on('close', (code) => {
          try { fs.unlinkSync(inputPath) } catch {}

          console.log('Compress stdout:', stdout)
          console.log('Compress stderr:', stderr)

          const hasOk = stdout.includes('OK:') && fs.existsSync(outputPath)
          const hasCompressed = fs.existsSync(outputPath) && fs.statSync(outputPath).size > 100

          if (hasOk || hasCompressed) {
            const stat = fs.statSync(outputPath)
            console.log('Compressed file size:', stat.size)
            
            const outputBuffer = fs.readFileSync(outputPath)

            try { fs.unlinkSync(outputPath) } catch {}

            resolve(new NextResponse(outputBuffer, {
              headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=compressed.pdf',
              },
            }))
          } else {
            console.log('Compression failed - no output file')
            resolve(NextResponse.json({ error: 'Compression failed. Try a different level.' }, { status: 500 }))
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