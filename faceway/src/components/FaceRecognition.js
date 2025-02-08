import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const FaceDetection = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models";
            await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

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

            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                faceapi.draw.drawDetections(canvasRef.current, detections);
                faceapi.draw.drawFaceLandmarks(canvasRef.current, detections);
            }
        };

        loadModels();

        let interval = setInterval(detectFaces, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Face Detection</h2>
            <div style={{ position: "relative", display: "inline-block" }}>
                <video ref={videoRef} autoPlay muted width="640" height="480" />
                <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
            </div>
        </div>
    );
};

export default FaceDetection;
