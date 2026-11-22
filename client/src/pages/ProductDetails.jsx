import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <section className="section"><h2>Product not found</h2></section>;
  }

  return (
    <section className="section details-layout">
      <img src={product.image} alt={product.name} />
      <div>
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <h2>₹{product.price.toLocaleString("en-IN")}</h2>
        <p>A little detail to make your everyday style feel special.</p>
        <Link to="/try-on" className="button button-dark">
          Try This Accessory
        </Link>
      </div>
    </section>
  );
}