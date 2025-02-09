import React, { useState, useEffect, useRef, useCallback } from "react";
import FaceRecognition from "./FaceRecognition";
import Stats from "./Stats";
import adImage1 from "../assets/ad1.jpg"; 
import adImage2 from "../assets/ad2.jpg";
import * as faceapi from "face-api.js";

const Kiosk = () => {
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [userData, setUserData] = useState(null);
  const videoRef = useRef(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [currentAd, setCurrentAd] = useState(adImage1);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      console.log("Face-API models loaded!");
      setIsModelsLoaded(true);
    };
    loadModels();
  }, []);

  const detectFace = useCallback(async () => {
    setInterval(async () => {
      if (!videoRef.current || showFaceRecognition || showStats) return;
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions());
      if (detection) {
        console.log("Face detected! Switching to recognition...");
        setShowFaceRecognition(true);
      }
    }, 2000);
  }, [showFaceRecognition, showStats]);

  const startVideo = useCallback(() => {
    if (!videoRef.current) return;
    navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
      videoRef.current.srcObject = stream;
      detectFace();
    }).catch(err => console.error("Camera access error:", err));
  }, [detectFace]);

  useEffect(() => {
    if (isModelsLoaded) {
      startVideo();
    }
  }, [isModelsLoaded, startVideo]);

  useEffect(() => {
    const adInterval = setInterval(() => {
      setCurrentAd((prevAd) => (prevAd === adImage1 ? adImage2 : adImage1));
    }, 5000);
    return () => clearInterval(adInterval);
  }, []);



  const handleFaceDetected = (user) => {
    setUserData(user);
    setShowFaceRecognition(false);
    setShowStats(true);
  };

  const handleCloseStats = () => {
    setShowStats(false);
    setShowFaceRecognition(false);
  };

  return (
      <div style={{ 
      textAlign: "center", 
      padding: "20px", 
      position: "relative"
    }}>
      {!showFaceRecognition && !showStats && (
        <div>
          <img src={currentAd} alt="Ad" style={{ width: "80%", maxHeight: "800px", transition: "opacity 1s ease-in-out" }} />
          <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />
          <div style={{
            position: "absolute",
            bottom: "1px",
            width: "96%",
            textAlign: "center",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "10px",
            fontSize: "18px",
            fontWeight: "bold",
            overflow: "hidden",
            whiteSpace: "nowrap"
          }}>
            <div style={{
              display: "inline-block", 
              animation: "scrollText 10s linear infinite",
              minWidth: "70%",
              whiteSpace: "nowrap"
            }}>
              FaceWAY!!  |   UIC SparkHacks 2025 |   Kirtan; Dravya; Dev; Neel; Dhru   |   FaceWAY!!
            </div>
          </div>
          <style>
            {`
              @keyframes scrollText {
                from {
                  transform: translateX(100%);
                }
                to {
                  transform: translateX(-100%);
                }
              }
            `}
          </style>
        </div>
      )}
      {showFaceRecognition && <FaceRecognition onRecognized={handleFaceDetected} />}
      {showStats && <Stats userData={userData} onClose={handleCloseStats} />}
    </div>
  );
};

export default Kiosk;