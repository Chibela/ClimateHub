import React from "react";

export default function LoadingSpinner({ size = 40 }) {
  return (
    <div className="loading-spinner">
      <div
        className="spinner"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
