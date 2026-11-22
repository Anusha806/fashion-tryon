import React, { useEffect, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

const FaceLandmarkerComponent = ({ videoRef }) => {
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [status, setStatus] = useState("Loading MediaPipe...");

  useEffect(() => {
    const initializeFaceLandmarker = async () => {
      try {
        console.log("Starting MediaPipe initialization...");

        setStatus("Loading face detection model...");

        // Use the WASM files installed through npm
        const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm"
);

        console.log("MediaPipe WASM loaded");

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

        console.log(
          "MediaPipe Face Landmarker created successfully"
        );

        setFaceLandmarker(landmarker);
        setStatus("MediaPipe ready");
      } catch (error) {
        console.error(
          "MEDIA PIPE INITIALIZATION ERROR:",
          error
        );

        setStatus("MediaPipe failed to load");
      }
    };

    initializeFaceLandmarker();
  }, []);

  useEffect(() => {
    if (!faceLandmarker) {
      return;
    }

    if (!videoRef.current) {
      console.log("Video element not available");
      return;
    }

    let animationFrameId;
    let lastVideoTime = -1;

    const detectFace = () => {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      if (
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;

          try {
            const results =
              faceLandmarker.detectForVideo(
                video,
                performance.now()
              );

            if (
              results &&
              results.faceLandmarks &&
              results.faceLandmarks.length > 0
            ) {
              setFaceDetected(true);
            } else {
              setFaceDetected(false);
            }
          } catch (error) {
            console.error(
              "FACE DETECTION ERROR:",
              error
            );
          }
        }
      }

      animationFrameId =
        requestAnimationFrame(detectFace);
    };

    console.log("Starting face detection loop...");

    detectFace();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [faceLandmarker, videoRef]);

  return (
    <div
      style={{
        marginTop: "15px",
        textAlign: "center",
        fontWeight: "600",
      }}
    >
      <p>{status}</p>

      {faceDetected ? (
        <p style={{ color: "green" }}>
          Face detected ✓
        </p>
      ) : (
        <p>Looking for your face...</p>
      )}
    </div>
  );
};

export default FaceLandmarkerComponent;