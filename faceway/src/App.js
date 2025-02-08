import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import FaceRecognition from "./components/FaceRecognition";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/dashboard" element={<FaceRecognition />} />
            </Routes>
        </Router>
    );
}

export default App;
