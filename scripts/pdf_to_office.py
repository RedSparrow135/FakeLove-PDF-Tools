import sys
import subprocess
import os
import shutil

def convert_pdf_to_office(pdf_path, output_format):
    temp_dir = os.path.dirname(pdf_path)
    
    format_options = {
        'docx': ('MS Word 2007 XML', '.docx'),
        'xlsx': ('Calc MS Excel 2007 XML', '.xlsx'),
        'pptx': ('Impress MS PowerPoint 2007 XML', '.pptx'),
    }
    
    if output_format not in format_options:
        return None
    
    filter_name, ext = format_options[output_format]
    
    output_base = os.path.join(temp_dir, f"output_{os.path.basename(pdf_path)}")
    
    cmd = [
        'libreoffice',
        '--headless',
        '--convert-to', ext[1:],
        '--outdir', temp_dir,
        '--infilter=input.pdf', 
        pdf_path
    ]
    
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=60
        )
    except subprocess.TimeoutExpired:
        return None
    except FileNotFoundError:
        return None
    
    possible_outputs = [
        pdf_path.replace('.pdf', ext),
        os.path.join(temp_dir, os.path.basename(pdf_path).replace('.pdf', ext)),
    ]
    
    for out_path in possible_outputs:
        if os.path.exists(out_path):
            return out_path
    
    if result.returncode == 0:
        for out_path in possible_outputs:
            if os.path.exists(out_path):
                return out_path
    
    return None

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('ERROR: Missing arguments')
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    output_format = sys.argv[2]
    
    if not os.path.exists(pdf_path):
        print('ERROR: PDF file not found')
        sys.exit(1)
    
    result = convert_pdf_to_office(pdf_path, output_format)
    
    if result:
        print(f'OK: {result}')
        sys.exit(0)
    else:
        print('ERROR: Conversion failed')
        sys.exit(1)