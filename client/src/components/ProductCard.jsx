import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function ProductCard({ product }) {
  const productId = product._id || product.id;
  const image = product.imageUrl || product.image;

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {image ? (
          <img src={image} alt={product.name} />
        ) : (
          <div className="product-image-fallback">
            Image coming soon
          </div>
        )}

        <button
          className="favorite-button"
          aria-label={`Add ${product.name} to favorites`}
          type="button"
        >
          <Heart size={19} />
        </button>
      </div>

      <p className="product-category">
        {product.category}
      </p>

      <h3>{product.name}</h3>

      <p className="product-price">
        ₹{Number(product.price).toLocaleString("en-IN")}
      </p>
SA
      <Link
        to={`/products/${productId}`}
        className="text-link"
      >
        View details →
      </Link>
    </article>
  );
}