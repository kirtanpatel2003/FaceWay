import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FaceRecognition.css";

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [descriptor, setDescriptor] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scanningInterval, setScanningInterval] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      console.log("Face-API models loaded!");
    };
    loadModels();
    startVideo();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
      videoRef.current.srcObject = stream;
      initiateScanning();
    });
  };

  const initiateScanning = () => {
    if (!videoRef.current) return;
    if (scanningInterval) clearInterval(scanningInterval);
  
    const interval = setInterval(async () => {
      if (!isScanning || !videoRef.current) return;
  
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
  
      if (detection) {
        setDescriptor(detection.descriptor);
        console.log("✅ Face detected! Checking for a match...");
        recognizeFace(detection.descriptor);
        setIsScanning(false);
        clearInterval(interval);
      } else {
        console.log("❌ No face detected. Adjust lighting and position.");
      }
    }, 2000);
    setScanningInterval(interval);
  };

  const recognizeFace = async (faceDescriptor) => {
    if (!faceDescriptor) return;
    try {
      const res = await axios.post("http://localhost:1234/recognize", { descriptor: faceDescriptor });
      if (res.data.success) {
        navigate("/stats", { state: { name: res.data.name, email: res.data.email, shopName: "Your Business Name", facepoints: res.data.facepoints } });
      } else {
        console.log("User not recognized.");
        setIsScanning(true);
        initiateScanning();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Recognition failed!");
    }
  };

  const registerFace = async () => {
    if (!descriptor) {
      alert("No face detected! Please look into the camera.");
      return;
    }
    if (!name || !email) {
      alert("Please enter both name and email.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:1234/register", {
        name,
        email,
        descriptor,
      });
      if (res.data.success) {
        alert("User registered successfully!");
        setIsScanning(true);
        initiateScanning();
      } else {
        alert("Registration failed: " + res.data.message);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Registration failed! Please check the backend.");
    }
  };

  return (
    <div className="face-recognition-container">
      <h2 className="title">Face Recognition</h2>
      <div className="video-container">
        <video ref={videoRef} autoPlay playsInline className="camera-feed" />
      </div>
      <button className="action-button" onClick={() => { setIsScanning(false); clearInterval(scanningInterval); }}>
        Add New User
      </button>
      {!isScanning && (
        <div className="form-container">
          <input type="text" placeholder="Enter Name" className="input-field" onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Enter Email" className="input-field" onChange={(e) => setEmail(e.target.value)} />
          <button className="register-button" onClick={registerFace}>Register Face</button>
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;
