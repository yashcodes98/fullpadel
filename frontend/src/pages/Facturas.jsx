import React, { useState } from "react";

const Facturas = () => {
  const data = [
    { id: 1, cliente: "Juan Pérez", fecha: "2024-11-15", total: "$150.00" },
    { id: 2, cliente: "María López", fecha: "2024-11-14", total: "$200.00" },
    { id: 3, cliente: "Carlos Sánchez", fecha: "2024-11-13", total: "$120.00" },
  ];

  const [procedencia, setProcedencia] = useState("");
  const [view, setView] = useState("tabla"); // Estado inicial seguro

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!procedencia) {
      // Si no se seleccionó una procedencia, mostramos una alerta
      alert("Por favor, selecciona la procedencia de la factura.");
      return;
    }

    if (file) {
      console.log(`Archivo cargado: ${file.name}`);
      
      // Crear un objeto FormData para enviar el archivo
      const formData = new FormData();
      formData.append("file", file);  // "file" es el nombre del campo que recibirá el backend
      formData.append("procedencia", procedencia);

      // Enviar el archivo al servidor Python mediante una solicitud POST
      fetch('http://localhost:5002/upload', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log('Respuesta del servidor:', data);
        })
        .catch(error => {
          console.error('Error al subir el archivo:', error);
        });
    } else {
      console.log('aa');
    }
  };

  return (
    <div className="facturas-container">
      <h1>Gestión de Facturas</h1>
      <div className="nav-buttons">
        <button onClick={() => setView("tabla")}>Visualizar Tabla</button>
        <button onClick={() => setView("insertar")}>Insertar Factura</button>
      </div>

      {view === "tabla" && (
        <div className="table-view">
          <h2>Facturas</h2>
          <table className="facturas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((factura) => (
                <tr key={factura.id}>
                  <td>{factura.id}</td>
                  <td>{factura.cliente}</td>
                  <td>{factura.fecha}</td>
                  <td>{factura.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{view === "insertar" && (
  <div className="upload-view" style={{ padding: "20px", border: "2px dashed #007BFF" }}>
    {/* Selector de procedencia */}
    <div style={{ marginBottom: "20px" }}>
      <label htmlFor="procedencia" style={{ fontWeight: "bold", marginRight: "10px" }}>
        Procedencia de la factura:
      </label>
      <select
        id="procedencia"
        onChange={(e) => setProcedencia(e.target.value)} // Actualizar el estado con el valor seleccionado
          style={{ padding: "5px", borderRadius: "4px", border: "1px solid #007BFF" }}
      >
        <option value="">Prodedencia de la factura</option>
        <option value="NOX">NOX</option>
        <option value="ADIDAS">ADIDAS</option>
        <option value="BULLPADEL">BULLPADEL</option>
        <option value="HEAD">HEAD</option>
        <option value="JOMA">JOMA</option>
        <option value="BODYMANIA">BODYMANIA</option>
      </select>
    </div>

    {/* Carga de archivos PDF */}
    <h2>Arrastra un archivo PDF aquí o haz clic para cargar</h2>
    <input
      type="file"
      accept="application/pdf"
      onChange={handleFileUpload}
      style={{ display: "none" }}
      id="file-input"
    />
    <label htmlFor="file-input" style={{ cursor: "pointer", color: "#007BFF" }}>
      Seleccionar archivo
    </label>
  </div>
)}

    </div>
  );
};

export default Facturas;
