import PyPDF2
import sys

def extract_text_from_pdf(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    print("Starting PDF extraction...")
    pdf_path = "DocScanner Feb 7, 2026 2-57 PM.pdf"
    try:
        import os
        if not os.path.exists(pdf_path):
            print(f"File not found: {pdf_path}")
        else:
            text = extract_text_from_pdf(pdf_path)
            if not text.strip():
                print("No text extracted. The PDF might be scanned/image-based.")
            else:
                print("Extracted Text:")
                print(text)
    except Exception as e:
        print(f"Error: {e}")
