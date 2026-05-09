import sys
import os
import subprocess
import tempfile

def convert_file(input_file, output_format=None):
    """
    Convierte archivos usando LibreOffice
    """
    if not os.path.exists(input_file):
        return {"success": False, "error": f"File not found: {input_file}"}
    
    input_ext = os.path.splitext(input_file)[1].lower()
    output_dir = os.path.dirname(input_file)
    base_name = os.path.splitext(os.path.basename(input_file))[0]
    
    # Mapa de conversiones
    to_pdf_formats = {
        '.doc': 'pdf', '.docx': 'pdf', '.odt': 'pdf', '.rtf': 'pdf',
        '.xls': 'pdf', '.xlsx': 'pdf', '.ods': 'pdf',
        '.ppt': 'pdf', '.pptx': 'pdf', '.odp': 'pdf',
        '.txt': 'pdf', '.csv': 'pdf',
    }
    
    from_pdf_formats = {
        '.pdf': ['doc', 'docx', 'xls', 'xlsx', 'pptx'],
    }
    
    # Determinar el formato de salida
    target_format = None
    
    if input_ext in to_pdf_formats:
        target_format = to_pdf_formats[input_ext]
    elif input_ext in from_pdf_formats:
        if output_format and output_format in from_pdf_formats[input_ext]:
            target_format = output_format
        else:
            target_format = from_pdf_formats[input_ext][0]
    else:
        return {"success": False, "error": f"Unsupported format: {input_ext}"}
    
    #buscar LibreOffice
    libreoffice_paths = [
        r"C:\Program Files\LibreOffice\program\soffice.exe",
        r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
        "/usr/bin/soffice",
    ]
    
    libreoffice_path = None
    for path in libreoffice_paths:
        if os.path.exists(path):
            libreoffice_path = path
            break
    
    if not libreoffice_path:
        return {"success": False, "error": "LibreOffice no encontrado"}
    
    #crear archivo de salida
    output_ext = target_format
    if target_format == 'docx':
        output_ext = 'doc'
    output_file = os.path.join(output_dir, f"{base_name}_converted.{output_ext}")
    
    try:
        #Ejecutar LibreOffice
        cmd = [
            libreoffice_path,
            "--headless",
            "--convert-to", target_format,
            "--outdir", output_dir,
            input_file
        ]
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=60
        )
        
        #Buscar archivo de salida
        if target_format == 'doc':
            possible_outputs = [
                os.path.join(output_dir, f"{base_name}.doc"),
                os.path.join(output_dir, f"{base_name}.docx"),
            ]
        elif target_format == 'xls':
            possible_outputs = [
                os.path.join(output_dir, f"{base_name}.xls"),
                os.path.join(output_dir, f"{base_name}.xlsx"),
            ]
        else:
            possible_outputs = [
                os.path.join(output_dir, f"{base_name}.{target_format}"),
            ]
        
        output_file = None
        for f in possible_outputs:
            if os.path.exists(f):
                output_file = f
                break
        
        if output_file and os.path.exists(output_file):
            return {
                "success": True,
                "output_file": output_file,
                "message": f"Converted {input_ext} to {target_format}"
            }
        else:
            error_msg = result.stderr or result.stdout or "Unknown error"
            return {"success": False, "error": f"Conversion failed: {error_msg}"}
            
    except subprocess.TimeoutExpired:
        return {"success": False, "error": "Conversion timeout"}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python converter.py <input_file> [output_format]")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_format = sys.argv[2] if len(sys.argv) > 2 else None
    
    result = convert_file(input_file, output_format)
    
    if result["success"]:
        print(f"OK:{result['output_file']}")
        print(result["message"])
    else:
        print(f"ERROR:{result['error']}")
        sys.exit(1)