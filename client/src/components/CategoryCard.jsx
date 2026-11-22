import { Link } from "react-router-dom";

export default function CategoryCard({ name, image, value }) {
  return (
    <Link
      to={`/products?category=${value}`}
      className="category-card"
    >
      <img src={image} alt={name} />
      <div className="category-overlay">
        <h3>{name}</h3>
        <span>Explore →</span>
      </div>
    </Link>
  );
}