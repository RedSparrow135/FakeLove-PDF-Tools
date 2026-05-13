import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

const MAX_SIZE = 4.5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const layout = (formData.get('layout') as string) || 'one'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      )
    }

    const oversized = files.filter(f => f.size > MAX_SIZE)
    if (oversized.length > 0) {
      return NextResponse.json(
        { error: `File "${oversized[0].name}" is too large. Max: 4.5MB` },
        { status: 413 }
      )
    }

    const pdf = await PDFDocument.create()
    const layoutMode = layout === 'two' ? 'twoPerPage' : 'onePerPage'

    if (layoutMode === 'twoPerPage') {
      for (let i = 0; i < files.length; i += 2) {
        const page = pdf.addPage([612, 792])
        const { width, height } = page.getSize()

        if (i < files.length) {
          const img1Data = await files[i].arrayBuffer()
          const img1Mime = files[i].type
          
          let img1
          if (img1Mime === 'image/png' || files[i].name.toLowerCase().endsWith('.png')) {
            img1 = await pdf.embedPng(img1Data)
          } else {
            img1 = await pdf.embedJpg(img1Data)
          }
          
          const img1Dims = img1.scaleToFit(width / 2 - 20, height - 40)
          page.drawImage(img1, {
            x: 10,
            y: height - img1Dims.height - 20,
            width: img1Dims.width,
            height: img1Dims.height,
          })
        }

        if (i + 1 < files.length) {
          const img2Data = await files[i + 1].arrayBuffer()
          const img2Mime = files[i + 1].type
          
          let img2
          if (img2Mime === 'image/png' || files[i + 1].name.toLowerCase().endsWith('.png')) {
            img2 = await pdf.embedPng(img2Data)
          } else {
            img2 = await pdf.embedJpg(img2Data)
          }
          
          const img2Dims = img2.scaleToFit(width / 2 - 20, height - 40)
          page.drawImage(img2, {
            x: width / 2 + 10,
            y: height - img2Dims.height - 20,
            width: img2Dims.width,
            height: img2Dims.height,
          })
        }
      }
    } else {
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const mimeType = file.type
        
        let img
        if (mimeType === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
          img = await pdf.embedPng(arrayBuffer)
        } else {
          img = await pdf.embedJpg(arrayBuffer)
        }
        
        const page = pdf.addPage([img.width, img.height])
        page.drawImage(img, {
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
        })
      }
    }

    const pdfBytes = await pdf.save()
    const buffer = Buffer.from(pdfBytes)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=images.pdf',
      },
    })
  } catch (error) {
    console.error('Image to PDF error:', error)
    return NextResponse.json(
      { error: 'Failed to convert images to PDF' },
      { status: 500 }
    )
  }
}