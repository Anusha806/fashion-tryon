import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import TryOn from "./pages/TryOnTest";
import Favorites from "./pages/Favorites";
import TryOnTest from "./pages/TryOnTest";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/try-on" element={<TryOn />} />
          <Route path="/try-on-test" element={<TryOnTest />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}