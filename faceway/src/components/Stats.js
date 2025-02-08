import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Welcome, {name}!</h2>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Shop:</strong> {shopName}</p>
      <p><strong>FacePoints:</strong> {facepoints}</p>
      
      <div style={{ width: "80%", margin: "20px auto", background: "#ddd", borderRadius: "10px" }}>
        <div
          style={{
            width: `${progress}%`,
            background: "green",
            height: "25px",
            borderRadius: "10px",
            transition: "width 0.5s ease-in-out",
          }}
        ></div>
      </div>
      <p>{progress >= 100 ? "🎉 You have earned a reward! Your points have been reset. 🎉" : `Only ${rewardThreshold - facepoints} more points to your reward!`}</p>
      
      <button onClick={() => navigate("/kiosk")}>Close</button>
    </div>
  );
};

export default Stats;
