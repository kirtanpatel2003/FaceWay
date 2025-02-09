import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Stats.css";

const Stats = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email, shopName, facepoints } = location.state || {};
  const rewardThreshold = 1000;
  const progress = (facepoints / rewardThreshold) * 100;

  useEffect(() => {
    if (facepoints >= rewardThreshold) {
      axios.post("http://localhost:1234/reset-facepoints", { email })
        .then(() => {
          console.log("FacePoints reset to 0 after reward");
        })
        .catch((error) => {
          console.error("Error resetting FacePoints:", error);
        });
    }
  }, [facepoints, email]);

  return (
    <div className="stats-container">
      <div className="stats-card">
        <h2 className="stats-title">🎉 Welcome, {name}! 🎉</h2>
        <p className="stats-text"><strong>Shop:</strong> Spark Coffee </p>
        <p className="stats-text"><strong>FacePoints:</strong> {facepoints}</p>

        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <p className="progress-text">
          {progress >= 100
            ? "🎉 You have earned a reward! Your points have been reset. 🎉"
            : `Only ${rewardThreshold - facepoints} more points to your reward!`}
        </p>

        <button className="close-button" onClick={() => navigate("/kiosk")}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Stats;
