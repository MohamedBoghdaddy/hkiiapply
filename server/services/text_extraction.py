import textract
from docx import Document
from pdfminer.high_level import extract_text as extract_pdf_text
from pdfminer.pdfparser import PDFSyntaxError
import logging
from dotenv import load_dotenv

load_dotenv()
# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def parse_pdf(file_path):
    """
    Extract text from a PDF file.
    """
    try:
        logging.info(f"Parsing PDF file: {file_path}")
        txt = extract_pdf_text(file_path).strip()
        if not txt:
            raise ValueError("Empty PDF content")
        logging.info("Successfully parsed PDF content.")
        return txt
    except FileNotFoundError:
        logging.error("File not found or path is incorrect")
        raise
    except PDFSyntaxError:
        logging.error("Not a valid PDF file")
        raise
    except Exception as e:
        logging.error(f"Unexpected error occurred while parsing PDF: {e}")
        raise

def parse_docx(file_path):
    """
    Extract text from a DOCX file.
    """
    try:
        logging.info(f"Parsing DOCX file: {file_path}")
        doc = Document(file_path)
        txt = "\n".join([paragraph.text for paragraph in doc.paragraphs]).strip()
        if not txt:
            raise ValueError("Empty DOCX content")
        logging.info("Successfully parsed DOCX content.")
        return txt
    except FileNotFoundError:
        logging.error("File not found or path is incorrect")
        raise
    except Exception as e:
        logging.error(f"Error parsing DOCX file: {e}")
        raise

def parse_doc(file_path):
    """
    Extract text from a DOC file using Textract.
    """
    try:
        logging.info(f"Parsing DOC file: {file_path}")
        txt = textract.process(file_path).decode("utf-8").strip()
        if not txt:
            raise ValueError("Empty DOC content")
        logging.info("Successfully parsed DOC content.")
        return txt
    except FileNotFoundError:
        logging.error("File not found or path is incorrect")
        raise
    except Exception as e:
        logging.error(f"Error parsing DOC file: {e}")
        raise

def parse_txt(file_path):
    """
    Extract text from a TXT file.
    """
    try:
        logging.info(f"Parsing TXT file: {file_path}")
        with open(file_path, 'r', encoding='utf-8') as file:
            txt = file.read().strip()
        if not txt:
            raise ValueError("Empty TXT content")
        logging.info("Successfully parsed TXT content.")
        return txt
    except FileNotFoundError:
        logging.error("File not found or path is incorrect")
        raise
    except Exception as e:
        logging.error(f"Error parsing TXT file: {e}")
        raise

def extract_text(file_path):
    """
    Extract text from a file based on its extension.
    Supports PDF, DOCX, DOC, and TXT files.
    """
    logging.info(f"Extracting text from file: {file_path}")
    if file_path.endswith(".pdf"):
        return parse_pdf(file_path)
    elif file_path.endswith(".docx"):
        return parse_docx(file_path)
    elif file_path.endswith(".doc"):
        return parse_doc(file_path)
    elif file_path.endswith(".txt"):
        return parse_txt(file_path)
    else:
        logging.error("Unsupported file format")
        raise ValueError("Unsupported file format")

# Example usage
if __name__ == "__main__":
    try:
        file_path = "example.pdf"  # Replace with the actual file path
        content = extract_text(file_path)
        print(content)
    except Exception as e:
        logging.error(f"Failed to extract text: {e}")
