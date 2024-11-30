import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Pedidos from "./pages/Pedidos.jsx";
import Stock from "./pages/Stock.jsx";
import Facturas from "./pages/Facturas.jsx";
import Ventas from "./pages/Ventas.jsx";
import Torneos from "./pages/Torneos.jsx";
import Extras from "./pages/Extras.jsx";


const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: "4rem" }}> {/* Para evitar superposición */}
        <Routes>
          <Route path="/" element={<Facturas />} />
          <Route path="/about" element={<Pedidos />} />
          <Route path="/contact" element={<Stock />} />
          <Route path="/Ventas" element={<Ventas />} />
          <Route path="/Torneos" element={<Torneos />} />
          <Route path="/Extras" element={<Extras />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;