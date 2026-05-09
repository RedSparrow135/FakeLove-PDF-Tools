"""
Smart PDF Compression - Fallback para producción
"""

import sys
import os
import re
import subprocess
import shutil
import requests

def find_executable(name):
    try:
        result = subprocess.run(['where', name], capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            return result.stdout.strip().split('\n')[0]
    except:
        pass
    return None

def find_ghostscript():
    possible_paths = [
        r"C:\Program Files\gs\gs10.07.0\bin\gswin64c.exe",
        r"C:\Program Files\gs\gs10.04.0\bin\gswin64c.exe",
        r"C:\Program Files\GS\gs10.04.0\bin\gswin64c.exe",
        r"C:\Program Files\Ghostscript\bin\gswin64c.exe",
    ]
    
    for p in possible_paths:
        if os.path.exists(p):
            return p
    
    found = find_executable('gswin64c')
    return found

def get_ghostscript_commands(level):
    base = ['-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4', '-dNOPAUSE', '-dQUIET', '-dBATCH']
    levels = {
        'low': base + ['-dPDFSETTINGS=/prepress', '-dJPEGQ=85', '-dColorImageResolution=150'],
        'medium': base + ['-dPDFSETTINGS=/ebook', '-dJPEGQ=70', '-dColorImageResolution=120'],
        'high': base + ['-dPDFSETTINGS=/screen', '-dJPEGQ=50', '-dColorImageResolution=96', '-dDownsampleColorImages=true'],
        'extreme': base + ['-dPDFSETTINGS=/screen', '-dJPEGQ=30', '-dColorImageResolution=72'],
    }
    return levels.get(level, levels['medium'])

def compress_ghostscript(input_path, output_path, level):
    gs = find_ghostscript()
    if not gs:
        return None
    
    cmd = [gs] + get_ghostscript_commands(level) + [f'-sOutputFile={output_path}', input_path]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if result.returncode == 0 and os.path.exists(output_path):
            size = os.path.getsize(output_path)
            if size > 0:
                return 'ghostscript'
    except:
        pass
    return None

def compress_api_fallback(input_path, output_path, level):
    """Use external compression API as fallback."""
    # You can use: CloudConvert, PDF.co, or similar
    # This is a placeholder - you'd need an API key
    
    API_ENDPOINTS = [
        ('pdfcompress', 'https://api.pdfcompress.com/v1/compress'),
        # Add more endpoints as needed
    ]
    
    for name, url in API_ENDPOINTS:
        try:
            # Example API call structure
            # Replace with your actual API integration
            pass
        except:
            continue
    
    return None

def compress_pikepdf(input_path, output_path, level):
    try:
        import pikepdf
        from pikepdf import Pdf
        
        pdf = Pdf.open(input_path)
        if level in ['high', 'extreme']:
            pdf.enable_compression()
        pdf.save(output_path, preserve_metadata=True)
        pdf.close()
        
        if os.path.exists(output_path):
            return 'pikepdf'
    except:
        pass
    return None

def compress_pypdf(input_path, output_path, level):
    try:
        from pypdf import PdfReader, PdfWriter
        
        reader = PdfReader(input_path)
        writer = PdfWriter()
        
        for page in reader.pages:
            writer.add_page(page)
        
        if level in ['high', 'extreme']:
            for p in writer.pages:
                try:
                    p.compress_content_streams()
                except:
                    pass
        
        with open(output_path, 'wb') as f:
            writer.write(f)
        
        if os.path.exists(output_path):
            return 'pypdf'
    except:
        pass
    return None

def analyze_pdf_type(input_path):
    try:
        with open(input_path, 'rb') as f:
            content = f.read()
        content_str = content.decode('latin-1', errors='ignore')
        
        img_count = len(re.findall(r'/Subtype\s*/\s*Image', content_str, re.IGNORECASE))
        text_count = len(re.findall(r'/Type\s*/\s*Text', content_str, re.IGNORECASE))
        
        if img_count > 10 and img_count > text_count:
            pdf_type = 'scanned'
        elif img_count > 5:
            pdf_type = 'mixed'
        else:
            pdf_type = 'text'
        
        return {'type': pdf_type, 'img_count': img_count}
    except:
        return {'type': 'unknown', 'img_count': 0}

def compress_pdf(input_path, output_path, level='medium'):
    if not os.path.exists(input_path):
        return {'success': False, 'error': 'Input not found'}
    
    input_size = os.path.getsize(input_path)
    pdf_type = analyze_pdf_type(input_path)['type']
    
    print(f"PDF type: {pdf_type}, Size: {input_size/1024/1024:.1f}MB")
    
    # Method priority: GS > pikepdf > pypdf
    method = compress_ghostscript(input_path, output_path, level)
    
    if not method:
        method = compress_pikepdf(input_path, output_path, level)
    
    if not method:
        method = compress_pypdf(input_path, output_path, level)
    
    if not method:
        shutil.copy(input_path, output_path)
        method = 'original'
    
    output_size = os.path.getsize(output_path)
    saved_percent = round((input_size - output_size) / input_size * 100, 1) if output_size < input_size else 0
    
    return {
        'success': True,
        'method': method,
        'input_size': input_size,
        'output_size': output_size,
        'saved_percent': saved_percent,
        'pdf_type': pdf_type
    }

# Check if GS is available for external tools
GS_AVAILABLE = find_ghostscript() is not None

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Ghostscript available:", GS_AVAILABLE)
        sys.exit(1)
    
    result = compress_pdf(sys.argv[1], sys.argv[2], sys.argv[3])
    
    if result['success']:
        print(f"OK:{sys.argv[2]}")
    else:
        print(f"ERROR:{result.get('error')}")