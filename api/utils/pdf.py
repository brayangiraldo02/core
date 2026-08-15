import pdfkit
import os
import shutil
import tempfile
import jinja2
from pathlib import Path
from io import BytesIO

def get_wkhtmltopdf_path() -> str:
    """Busca la ruta de wkhtmltopdf en el sistema con fallback"""
    env_path = os.getenv('WKHTMLTOPDF_PATH')
    if env_path and os.path.exists(env_path):
        return env_path
    
    which_path = shutil.which('wkhtmltopdf')
    if which_path:
        return which_path

    common_paths = [
        '/usr/local/bin/wkhtmltopdf',
        '/usr/bin/wkhtmltopdf',
        'C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe',
    ]
    for path in common_paths:
        if os.path.exists(path):
            return path

    return '/usr/local/bin/wkhtmltopdf'

def html2pdf(title: str, html_path: str, pdf_path: str, header_path: str = None, footer_path: str = None, orientation: str = 'Portrait'):
    """
    Convierte un archivo HTML a PDF utilizando pdfkit y wkhtmltopdf.
    """
    options = {
        'page-size': 'Letter',
        'margin-top': '1in',
        'margin-right': '0.6in',
        'margin-bottom': '0.6in',
        'margin-left': '0.6in',
        'encoding': "UTF-8",
        'no-outline': None,
        'enable-local-file-access': None,
        'header-spacing': '5',
        'footer-spacing': '5',
        'orientation': orientation,
    }

    if header_path and os.path.exists(header_path):
        options['header-html'] = header_path

    if footer_path and os.path.exists(footer_path):
        options['footer-html'] = footer_path

    config = pdfkit.configuration(wkhtmltopdf=get_wkhtmltopdf_path())

    if isinstance(pdf_path, BytesIO):
        with open(html_path, 'r', encoding='utf-8') as f:
            pdf_bytes = pdfkit.from_file(f, False, options=options, configuration=config)
        pdf_path.write(pdf_bytes)
    else:
        with open(html_path, 'r', encoding='utf-8') as f:
            pdfkit.from_file(f, pdf_path, options=options, configuration=config)

def render_template_to_pdf(
    template_name: str,
    data_view: dict,
    title: str = "Reporte",
    orientation: str = "Portrait"
) -> tuple[str, list[str]]:
    """
    Renderiza una plantilla Jinja2 junto con header y footer a un archivo PDF temporal.
    Retorna (ruta_pdf, [rutas_archivos_temporales_a_eliminar]).
    """
    current_dir = Path(__file__).resolve().parent
    templates_dir = current_dir.parent / "templates"

    template_loader = jinja2.FileSystemLoader(searchpath=str(templates_dir))
    template_env = jinja2.Environment(loader=template_loader, autoescape=True)

    template = template_env.get_template(template_name)
    output_html = template.render(data_view=data_view)

    temp_files = []

    # Archivo HTML principal temporal
    with tempfile.NamedTemporaryFile(delete=False, suffix='.html', mode='w', encoding='utf-8') as f_html:
        html_path = f_html.name
        f_html.write(output_html)
        temp_files.append(html_path)

    # Header temporal si existe
    header_path = None
    if (templates_dir / "header.html").exists():
        header_template = template_env.get_template("header.html")
        header_html = header_template.render(data_view=data_view)
        with tempfile.NamedTemporaryFile(delete=False, suffix='.html', mode='w', encoding='utf-8') as f_header:
            header_path = f_header.name
            f_header.write(header_html)
            temp_files.append(header_path)

    # Footer temporal si existe
    footer_path = None
    if (templates_dir / "footer.html").exists():
        footer_template = template_env.get_template("footer.html")
        footer_html = footer_template.render(data_view=data_view)
        with tempfile.NamedTemporaryFile(delete=False, suffix='.html', mode='w', encoding='utf-8') as f_footer:
            footer_path = f_footer.name
            f_footer.write(footer_html)
            temp_files.append(footer_path)

    # Archivo PDF temporal resultante
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as f_pdf:
        pdf_path = f_pdf.name

    html2pdf(
        title=title,
        html_path=html_path,
        pdf_path=pdf_path,
        header_path=header_path,
        footer_path=footer_path,
        orientation=orientation
    )

    return pdf_path, temp_files
