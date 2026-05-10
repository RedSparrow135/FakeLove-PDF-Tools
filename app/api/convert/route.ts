import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import os from 'os'

const PYTHON_SCRIPT = path.join(process.cwd(), 'scripts', 'converter.py')

function tempFilePath(ext: string): string {
  return path.join(os.tmpdir(), `fakelove_${Date.now()}.${ext}`)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('files') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided 💔' }, { status: 400 })
    }

    const inputExt = file.name.split('.').pop()?.toLowerCase() || ''
    const outputFormat = getFormatFromExtension(inputExt)
    
    if (!outputFormat) {
      return NextResponse.json({ error: `Cannot convert ${inputExt}. We don't speak that language. 😢` }, { status: 400 })
    }

    const inputPath = tempFilePath(inputExt)
    const inputBuffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(inputPath, inputBuffer)

    try {
      return new Promise<NextResponse>((resolve) => {
        const args = [PYTHON_SCRIPT, inputPath]
        const proc = spawn('python', args)
        
        let stdout = '', stderr = ''

        proc.stdout.on('data', (data) => { 
          const text = data.toString()
          stdout += text
        })
        
        proc.stderr.on('data', (data) => { 
          const text = data.toString()
          stderr += text
        })

        proc.on('close', (code) => {
          try { fs.unlinkSync(inputPath) } catch {}

          if (code === 0 && stdout.includes('OK:')) {
            const match = stdout.match(/OK:(.+)/)
            const outputPath = match?.[1]?.trim()
            
            if (outputPath && fs.existsSync(outputPath)) {
              const outputBuffer = fs.readFileSync(outputPath)
              const outputExt = path.extname(outputPath).slice(1)
              const filename = file.name.replace(/\.[^.]+$/, `.${outputExt}`)

              try { fs.unlinkSync(outputPath) } catch {}

              resolve(new NextResponse(outputBuffer, {
                headers: {
                  'Content-Type': 'application/pdf',
                  'Content-Disposition': `attachment; filename=${filename}`,
                },
              }))
            } else {
              resolve(NextResponse.json({ error: 'Output file not created 💔' }, { status: 500 }))
            }
          } else {
            const errMsg = stderr || stdout || 'LibreOffice might not be working properly'
            console.log('Convert error:', errMsg)
            resolve(NextResponse.json({ error: errMsg }, { status: 500 }))
          }
        })

        proc.on('error', (err) => {
          try { fs.unlinkSync(inputPath) } catch {}
          console.log('Spawn error:', err.message)
          resolve(NextResponse.json({ error: 'Cannot run Python 🐍: ' + err.message }, { status: 500 }))
        })

        setTimeout(() => { 
          try { proc.kill() } catch {}
          resolve(NextResponse.json({ error: 'Conversion timeout ⏰ - Our love has expired' }, { status: 500 })) 
        }, 60000)
      })
    } catch (conversionError) {
      try { fs.unlinkSync(inputPath) } catch {}
      console.log('Conversion error:', conversionError)
      return NextResponse.json({ error: `Conversion error: ${conversionError}` }, { status: 500 })
    }
  } catch (error) {
    console.log('API error:', error)
    return NextResponse.json({ error: 'Something broke 💔' }, { status: 500 })
  }
}

function getFormatFromExtension(ext: string): string {
  const formats: Record<string, string> = {
    'doc': 'pdf',
    'docx': 'pdf',
    'xls': 'pdf',
    'xlsx': 'pdf',
    'ppt': 'pdf',
    'pptx': 'pdf',
    'odt': 'pdf',
    'ods': 'pdf',
    'odp': 'pdf',
    'rtf': 'pdf',
    'txt': 'pdf',
    'csv': 'pdf',
  }
  return formats[ext] || ''
}