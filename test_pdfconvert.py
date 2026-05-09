import sys
import os
import subprocess

# Crear un PDF simple para probar
pdf_content = """%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT /F1 24 Tf 100 700 Td (Test PDF) Tj ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000224 00000 n 
0000000312 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
406
%%EOF
"""

with open("test.pdf", "w") as f:
    f.write(pdf_content)

result = subprocess.run(
    ["python", "converter.py", "test.pdf", "doc"],
    capture_output=True,
    text=True,
    timeout=60
)
print("stdout:", result.stdout)
print("stderr:", result.stderr)
print("returncode:", result.returncode)