import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const FaceRecognition = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [statusMessage, setStatusMessage] = useState("Initializing...");

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models";

            await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

            setStatusMessage("Models Loaded. Starting Camera...");
            startVideo();
        };

        const startVideo = () => {
            navigator.mediaDevices.getUserMedia({ video: {} })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => console.error("Error accessing webcam: ", err));
        };

        const detectFaces = async () => {
            if (!videoRef.current) return;

            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
                .withFaceLandmarks()
                .withFaceDescriptors();

            if (detections.length > 0) {
                setStatusMessage("Face Detected. Processing...");
                sendFaceData(detections[0].descriptor);
            }

            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                faceapi.draw.drawDetections(canvasRef.current, detections);
                faceapi.draw.drawFaceLandmarks(canvasRef.current, detections);
            }
        };

        const sendFaceData = async (faceDescriptor) => {
            try {
                const response = await axios.post("http://localhost:1234/verify-face", { descriptor: faceDescriptor });
                setStatusMessage(response.data.message);
            } catch (error) {
                console.error("Error sending face data:", error);
                setStatusMessage("Error verifying face.");
            }
        };

        loadModels();
        const interval = setInterval(detectFaces, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Face Recognition System</h2>
            <p>{statusMessage}</p>
            <div style={{ position: "relative", display: "inline-block" }}>
                <video ref={videoRef} autoPlay muted width="640" height="480" />
                <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
            </div>
        </div>
    );
};

export default FaceRecognition;
