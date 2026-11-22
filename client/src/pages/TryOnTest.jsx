import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import FaceOverlay from "../components/FaceOverlay";

import CameraView from "../components/CameraView";

const TryOnTest = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [faceDetected, setFaceDetected] = useState(false);
  const [faceLandmarker, setFaceLandmarker] = useState(null);

  const videoRef = useRef(null);

  // This will store the latest face landmarks
  const landmarksRef = useRef(null);

  // ------------------------------------
  // 1. Fetch products
  // ------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // ------------------------------------
  // 2. Initialize MediaPipe
  // ------------------------------------
  useEffect(() => {
    let cancelled = false;

    const initializeFaceLandmarker = async () => {
      try {
        console.log("Loading MediaPipe...");

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm"
        );

        const landmarker = await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "CPU",
            },

            runningMode: "VIDEO",

            numFaces: 1,

            minFaceDetectionConfidence: 0.5,
            minFacePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          }
        );

        if (!cancelled) {
          setFaceLandmarker(landmarker);
          console.log("MediaPipe loaded successfully ✓");
        }
      } catch (error) {
        console.error("MediaPipe initialization failed:", error);
      }
    };

    initializeFaceLandmarker();

    return () => {
      cancelled = true;
    };
  }, []);

  // ------------------------------------
  // 3. Detect face continuously
  // ------------------------------------
  useEffect(() => {
    if (!faceLandmarker) return;

    let animationFrameId;

    const detectFace = () => {
      const video = videoRef.current;

      if (!video || video.readyState < 2) {
        animationFrameId = requestAnimationFrame(detectFace);
        return;
      }

      try {
        const results = faceLandmarker.detectForVideo(
          video,
          performance.now()
        );

        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
          const landmarks = results.faceLandmarks[0];

          // Save latest landmarks
          landmarksRef.current = landmarks;

          setFaceDetected(true);
        } else {
          landmarksRef.current = null;

          setFaceDetected(false);
        }
      } catch (error) {
        console.error("Face detection error:", error);
      }

      animationFrameId = requestAnimationFrame(detectFace);
    };

    detectFace();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [faceLandmarker]);

  return (
    <div
      style={{
        padding: "40px",
        minHeight: "100vh",
        background: "#faf7f2",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Virtual Try-On Test
      </h1>

      {/* Camera */}
      <div
        style={{
          position: "relative",
          width: "640px",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <CameraView videoRef={videoRef} />

        <FaceOverlay
          videoRef={videoRef}
          landmarksRef={landmarksRef}
          selectedProduct={selectedProduct}
        />
      </div>

      {/* Face detection status */}
      <div
        style={{
          textAlign: "center",
          marginTop: "15px",
          marginBottom: "30px",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        {!faceLandmarker && "Loading face detection..."}

        {faceLandmarker && !faceDetected && "Face not detected"}

        {faceLandmarker && faceDetected && (
          <span style={{ color: "green" }}>
            Face detected ✓
          </span>
        )}
      </div>

      {/* Products */}
      <h2 style={{ marginBottom: "20px" }}>
        Select an accessory
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => setSelectedProduct(product)}
            style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "15px",
              cursor: "pointer",
              border:
                selectedProduct?._id === product._id
                  ? "3px solid #b8860b"
                  : "1px solid #ddd",
            }}
          >
            <img
              src={`http://localhost:5173${product.imageUrl}`}
              alt={product.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "contain",
              }}
            />

            <h3>{product.name}</h3>

            <p>₹{product.price}</p>
          </div>
        ))}
      </div>

      {/* Selected product */}
      {selectedProduct && (
        <div
          style={{
            marginTop: "40px",
            textAlign: "center",
          }}
        >
          <h2>{selectedProduct.name}</h2>

          <img
            src={`http://localhost:5173${selectedProduct.tryOnImageUrl}`}
            alt={`${selectedProduct.name} try on`}
            style={{
              width: "200px",
              height: "200px",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TryOnTest;