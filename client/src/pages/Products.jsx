import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const gender = searchParams.get("gender") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products", {
          params: {
            category,
            gender,
          },
        });

        setProducts(response.data.products);
      } catch (err) {
        console.error("Product loading error:", err);

        setError(
          "Could not load products. Please check the backend connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, gender]);

  return (
    <section className="section page-section">
      <p className="eyebrow">THE COLLECTION</p>

      <h1>
        {category
          ? category.charAt(0).toUpperCase() + category.slice(1)
          : "Shop All Accessories"}
      </h1>

      {loading && <p>Loading accessories...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={{
                  ...product,
                  id: product._id,
                  image: product.imageUrl,
                }}
              />
            ))}
          </div>

          {products.length === 0 && (
            <p>No products found in this category yet.</p>
          )}
        </>
      )}
    </section>
  );
}