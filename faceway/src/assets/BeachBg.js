import React from "react";
import Wave from "react-wavify";
import "./BeachBg.css";

const BeachBackground = ({ children }) => {
  return (
    <div className="beach-container">
      {children}
      <Wave
        fill="rgba(19, 103, 176, 0.7)"
        paused={false}
        style={{ position: "absolute", bottom: 0, width: "100%", zIndex: 1 }}
        options={{
          height: 40,
          amplitude: 25,
          speed: 0.2,
          points: 5,
        }}
      />
      
      <Wave
        fill="rgba(17, 90, 154, 0.6)"
        paused={false}
        style={{ position: "absolute", bottom: -5, width: "100%", zIndex: 0 }}
        options={{
          height: 35,
          amplitude: 20,
          speed: 0.15,
          points: 4,
        }}
      />
    </div>
  );
};

export default BeachBackground;
