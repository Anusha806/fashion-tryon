import { Link, NavLink } from "react-router-dom";
import { Search, Heart, UserRound, ShoppingBag } from "lucide-react";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">A</span>
        <span>ADORN</span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Shop All</NavLink>
        <NavLink to="/products?category=earrings">Earrings</NavLink>
        <NavLink to="/products?category=necklaces">Necklaces</NavLink>
        <NavLink to="/try-on">Virtual Try-On</NavLink>
      </nav>

      <div className="nav-actions">
        <button aria-label="Search"><Search /></button>
        <Link to="/favorites" aria-label="Favorites"><Heart /></Link>
        <button aria-label="Account"><UserRound /></button>
        <button aria-label="Shopping bag"><ShoppingBag /></button>
      </div>
    </header>
  );
}