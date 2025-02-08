import React, { useState, useEffect, useRef } from "react";
import FaceRecognition from "./FaceRecognition";
import Stats from "./Stats";
import adImage from "../assets/ad.jpg";
import * as faceapi from "face-api.js";

const Kiosk = () => {
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [userData, setUserData] = useState(null);
  const videoRef = useRef(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);

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

  useEffect(() => {
    if (isModelsLoaded) {
      startVideo();
    }
  }, [isModelsLoaded]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        detectFace();
      }
    });
  };

  const detectFace = async () => {
    setInterval(async () => {
      if (!videoRef.current || showFaceRecognition || showStats) return;

      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions());

      if (detection) {
        console.log("Face detected! Switching to recognition...");
        setShowFaceRecognition(true);
      }
    }, 2000);
  };

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
    <div style={{ textAlign: "center", padding: "20px", position: "relative" }}>
      {!showFaceRecognition && !showStats && (
        <div>
          <h2>Advertisement</h2>
          <img src={adImage} alt="Ad" style={{ width: "100%", maxHeight: "500px" }} />
          <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />
          <div style={{ 
            position: "absolute", 
            bottom: "10px", 
            width: "100%", 
            overflow: "hidden", 
            whiteSpace: "nowrap" 
          }}>
            <marquee behavior="scroll" direction="left" style={{ fontSize: "18px", fontWeight: "bold" }}>
              Special Offer: Buy 1 Get 1 Free | 20% Off on All Items | Visit Our Store Today!
            </marquee>
          </div>
        </div>
      )}
      {showFaceRecognition && <FaceRecognition onRecognized={handleFaceDetected} />}
      {showStats && <Stats userData={userData} onClose={handleCloseStats} />}
    </div>
  );
};

export default Kiosk;
