import React, { useEffect } from "react";

const CameraView = ({ videoRef }) => {
  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access failed:", error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoRef]);

  return (
    <div
      style={{
        width: "640px",
        maxWidth: "100%",
        margin: "0 auto",
        background: "#000",
        borderRadius: "15px",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          display: "block",
          transform: "scaleX(-1)",
        }}
      />
    </div>
  );
};

export default CameraView;