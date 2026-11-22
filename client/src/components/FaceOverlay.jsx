import React, { useEffect, useRef } from "react";

const FaceOverlay = ({
  videoRef,
  landmarksRef,
  selectedProduct,
}) => {
  const canvasRef = useRef(null);

  // Store the loaded earring image
  const imageRef = useRef(null);

  // --------------------------------------
  // Load selected product image
  // --------------------------------------
  useEffect(() => {
    imageRef.current = null;

    if (
      !selectedProduct ||
      selectedProduct.category !== "earrings" ||
      !selectedProduct.tryOnImageUrl
    ) {
      return;
    }

    const image = new Image();

    image.src =
      `http://localhost:5173${selectedProduct.tryOnImageUrl}`;

    image.onload = () => {
      imageRef.current = image;
      console.log("Earring image loaded ✓");
    };

    image.onerror = () => {
      console.error(
        "Failed to load earring image:",
        image.src
      );
    };
  }, [selectedProduct]);

  // --------------------------------------
  // Draw everything
  // --------------------------------------
  useEffect(() => {
    let animationFrameId;

    const drawOverlay = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) {
        animationFrameId =
          requestAnimationFrame(drawOverlay);

        return;
      }

      const width = video.videoWidth;
      const height = video.videoHeight;

      if (!width || !height) {
        animationFrameId =
          requestAnimationFrame(drawOverlay);

        return;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      // Clear previous frame
      ctx.clearRect(0, 0, width, height);

      const landmarks = landmarksRef.current;

      if (!landmarks) {
        animationFrameId =
          requestAnimationFrame(drawOverlay);

        return;
      }

      // ======================================
      // 1. DRAW RED LANDMARKS
      // ======================================

      landmarks.forEach((landmark) => {
        const x = landmark.x * width;
        const y = landmark.y * height;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          2,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = "red";
        ctx.fill();
      });

      // ======================================
      // 2. DRAW EARRINGS
      // ======================================

      if (
        selectedProduct &&
        selectedProduct.category === "earrings" &&
        imageRef.current
      ) {
        drawEarrings(
          ctx,
          imageRef.current,
          landmarks,
          width,
          height
        );
      }

      animationFrameId =
        requestAnimationFrame(drawOverlay);
    };

    drawOverlay();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    videoRef,
    landmarksRef,
    selectedProduct,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",

        // Keep canvas aligned with mirrored camera
        transform: "scaleX(-1)",
      }}
    />
  );
};


// ==========================================
// EARRING POSITIONING
// ==========================================

const drawEarrings = (
  ctx,
  image,
  landmarks,
  width,
  height
) => {

  /*
    Initial anchor points.

    These are approximate points around
    the sides of the face.

    We will fine-tune them after testing.
  */

  const leftAnchor = landmarks[132];
  const rightAnchor = landmarks[361];

  if (!leftAnchor || !rightAnchor) {
    return;
  }

  // ----------------------------------------
  // Convert landmark coordinates to pixels
  // ----------------------------------------

  const leftX =
    leftAnchor.x * width;

  const leftY =
    leftAnchor.y * height;

  const rightX =
    rightAnchor.x * width;

  const rightY =
    rightAnchor.y * height;


  // ----------------------------------------
  // Calculate earring size
  // ----------------------------------------

  const earringWidth =
    width * 0.10;

  const aspectRatio =
    image.height / image.width;

  const earringHeight =
    earringWidth * aspectRatio;


  // ----------------------------------------
  // Position adjustment
  // ----------------------------------------

  const xOffset =
    earringWidth * 0.15;

  const yOffset =
    earringHeight * 0.15;


  // ========================================
  // LEFT EARRING
  // ========================================

  ctx.drawImage(
    image,

    leftX -
      earringWidth / 2 -
      xOffset,

    leftY +
      yOffset,

    earringWidth,
    earringHeight
  );


  // ========================================
  // RIGHT EARRING
  // ========================================

  ctx.drawImage(
    image,

    rightX -
      earringWidth / 2 +
      xOffset,

    rightY +
      yOffset,

    earringWidth,
    earringHeight
  );
};

export default FaceOverlay;