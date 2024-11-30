import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css"; // Asegúrate de crear este archivo.

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/" className="nav-link" activeClassName="active-link" exact>
            Facturas
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="nav-link" activeClassName="active-link">
            Pedidos
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="nav-link" activeClassName="active-link">
            Stock
          </NavLink>
        </li>
        <li>
          <NavLink to="/Ventas" className="nav-link" activeClassName="active-link">
            Ventas
          </NavLink>
        </li>
        <li>
          <NavLink to="/Torneos" className="nav-link" activeClassName="active-link">
            Torneos
          </NavLink>
        </li>
        <li>
          <NavLink to="/Extras" className="nav-link" activeClassName="active-link">
            Extras
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
