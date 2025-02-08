import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import FaceRecognition from "./components/FaceRecognition";
import Stats from "./components/Stats";
import Kiosk from "./components/Kiosk";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/kiosk" element={<Kiosk />} />
                <Route path="/dashboard" element={<FaceRecognition />} />
                <Route path="/stats" element={<Stats />} />
            </Routes>
        </Router>
    );
}

export default App;
