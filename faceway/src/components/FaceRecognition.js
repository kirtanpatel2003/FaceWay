import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isNewUser, setIsNewUser] = useState(null);
  const [descriptor, setDescriptor] = useState(null);

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
    });
  };

  const captureFace = async () => {
    if (!videoRef.current) return;
    
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
  
    if (detection) {
      setDescriptor(detection.descriptor);
      console.log("Face detected!");
    } else {
      console.log("No face detected. Try again.");
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
      } else {
        alert("Registration failed: " + res.data.message);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Registration failed! Please check the backend.");
    }
  };
  

  const recognizeFace = async () => {
    if (!descriptor) {
      alert("Please capture a face first.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:1234/recognize", { descriptor });
      alert(res.data.success ? `Welcome, ${res.data.email}!` : "User not recognized.");
    } catch (error) {
      console.error("Error:", error);
      alert("Recognition failed!");
    }
  };

  return (
    <div>
      <h2>Face Recognition</h2>
      <video ref={videoRef} autoPlay playsInline width="400" height="300" onPlay={captureFace} />

      {isNewUser === null && (
        <div>
          <button onClick={() => setIsNewUser(true)}>New User</button>
          <button onClick={() => setIsNewUser(false)}>Existing User</button>
        </div>
      )}

      {isNewUser === true && (
        <div>
          <input type="text" placeholder="Enter Name" onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
          <button onClick={registerFace}>Register Face</button>
        </div>
      )}

      {isNewUser === false && (
        <div>
          <button onClick={recognizeFace}>Recognize Face</button>
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;
