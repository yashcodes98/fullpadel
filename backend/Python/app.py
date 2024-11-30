from flask import Flask, request, jsonify
import os
import re
import pdfplumber
from flask_cors import CORS

app = Flask(__name__)
# Configuración de CORS para permitir solicitudes desde cualquier origen
CORS(app, resources={r"/*": {"origins": "*"}})
@app.route('/')
def hello_world():
    return 'Servidor Flask corriendo'


# Ruta donde se recibe el archivo
@app.route('/upload', methods=['POST'])
def upload_file(): 
    print("aaaaa")
    # Verificar si se envió un archivo
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    procedencia = request.form.get('procedencia')

    if not procedencia:
        return jsonify({'error': 'Procedencia is required'}), 400  # Devolver un error si no se pasa la procedencia


    # Crear la ruta del directorio con la procedencia
    upload_folder = os.path.join('uploads', procedencia)

    # Crear el directorio si no existe
    os.makedirs(upload_folder, exist_ok=True)

    # Crear la ruta completa del archivo
    file_path = os.path.join(upload_folder, file.filename)

    # Guardar el archivo
    file.save(file_path)

    try:
        invoice_data = extract_invoice_data(file_path)
    except Exception as e:
        return jsonify({'error': f'Error processing the PDF: {str(e)}'}), 500

    return jsonify({
        'message': 'File uploaded and processed successfully',
        'filename': file.filename,
        'invoice_data': invoice_data
    })


# Esta es la primera función de extracción de datos, hecha por defecto para las facturas de nox.
def extract_invoice_data(pdf_path):
    """
    Función para extraer datos de una factura PDF.
    """
    data = {}

    fecha_pattern = r"\d{1,2} de \w+ de \d{4}"
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            
            # Extraer el número de factura
            if "Factura No:" in text:
                data["Factura No"] = text.split("Factura No:")[1].split("\n")[0].strip()
                print(f"Factura No: {data['Factura No']}")

            # Extraer la fecha
            fecha_match = re.search(fecha_pattern, text)

            # Ejemplo de código corregido:
            if fecha_match:  # Si fecha_match no es None
                data["Fecha"] = fecha_match.group(0)  # Asigna la fecha encontrada
                print(f"Fecha: {data['Fecha']}")  # Imprime la fecha
            else:
                print("Fecha no encontrada.")  # Si no se encuentra fecha, imprime un mensaje



            # Extraer información del cliente y NIF
            if "CLIENTE:" in text:
                cliente_info = text.split("CLIENTE:")[1].split("Divisa:")[0].strip()
                cliente_lineas = cliente_info.split("\n")
                data["Cliente"] = cliente_lineas[0].strip()
                data["NIF Cliente"] = cliente_lineas[-1].split()[-1]

            # Extraer detalles de productos
            if "Referencia Descripción Cantidad Precio Dto Importe" in text:
                productos = []
                lines = text.split("\n")
                start_index = lines.index("Referencia Descripción Cantidad Precio Dto Importe") + 1
                
                for line in lines[start_index:]:
                    if "Base Descuento" in line:  # Fin de los productos
                        break
                    else:
                        partes = line.split()
                        if len(partes) >= 6:  # Validar que la línea tenga datos esperados
                            producto = {
                                "Referencia": partes[0],
                                "Descripción": " ".join(partes[1:-4]),
                                "Cantidad": partes[-4],
                                "Precio": partes[-3],
                                "Descuento": partes[-2],
                                "Importe": partes[-1],
                            }
                            productos.append(producto)
                data["Productos"] = productos

                print("Productos extraídos:")
                for producto in productos:
                    print(f"- Referencia: {producto['Referencia']}")
                    print(f"  Descripción: {producto['Descripción']}")
                    print(f"  Cantidad: {producto['Cantidad']}")
                    print(f"  Precio: {producto['Precio']}")
                    print(f"  Descuento: {producto['Descuento']}")
                    print(f"  Importe: {producto['Importe']}")
                    print("-------------------------")

            # Extraer forma de pago
            if "Forma de Pago" in text:
                data["Forma de Pago"] = text.split("Forma de Pago")[1].split("\n")[0].strip()

            # Extraer vencimiento
            if "Vencimientos" in text:
                data["Vencimiento"] = text.split("Vencimientos")[1].split("\n")[0].strip()
                print(f"Vencimiento: {data['Vencimiento']}")

            # Extraer el total
            if "TOTAL €" in text:
                data["Total"] = text.split("TOTAL €")[1].split("\n")[0].strip()
                print(f"Total: {data['Total']}")

    return data


if __name__ == "__main__":
    app.run(debug=True, port=5002)  # El servidor se ejecutará en el puerto 5002
