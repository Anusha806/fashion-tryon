import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";

const categories = [
  {
    name: "Earrings",
    value: "earrings",
    image: "https://placehold.co/700x850/EDE4D8/51483D?text=Earrings",
  },
  {
    name: "Necklaces",
    value: "necklaces",
    image: "https://placehold.co/700x850/EDE4D8/51483D?text=Necklaces",
  },
  {
    name: "Watches",
    value: "watches",
    image: "https://placehold.co/700x850/EDE4D8/51483D?text=Watches",
  },
  {
    name: "Rings",
    value: "rings",
    image: "https://placehold.co/700x850/EDE4D8/51483D?text=Rings",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">THE ART OF ACCESSORIZING</p>
          <h1>The little details make the look.</h1>
          <p>
            Discover accessories that feel like you.
            Explore your style and try your favorites virtually.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="button button-dark">
              Explore Collection
            </Link>
            <Link to="/try-on" className="button button-light">
              Try It On
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://placehold.co/1000x900/E8DED2/51483D?text=Your+Style+Your+Details"
            alt="Accessories collection"
          />
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SHOP BY STYLE</p>
            <h2>Find your favorite details</h2>
          </div>
          <Link to="/products" className="text-link">View all →</Link>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.value} {...category} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CURATED FOR YOU</p>
            <h2>Featured accessories</h2>
          </div>
          <Link to="/products" className="text-link">Shop all →</Link>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="try-banner">
        <div>
          <p className="eyebrow">YOUR VIRTUAL STYLING ROOM</p>
          <h2>See how it looks before you choose.</h2>
          <p>Try accessories on virtually, right from your browser.</p>
          <Link to="/try-on" className="button button-dark">
            Start Virtual Try-On
          </Link>
        </div>
      </section>
    </>
  );
}