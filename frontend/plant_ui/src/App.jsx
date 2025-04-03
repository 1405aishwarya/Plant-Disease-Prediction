import React, { useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam"; // Import the Webcam component
import diseaseInfo from "./diseaseInfo.json"; // Import disease information
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [captureMode, setCaptureMode] = useState(false); // Track if in capture mode
  const webcamRef = useRef(null); // Reference to the webcam

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);

    // Create a preview of the uploaded image
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    let formData = new FormData();

    if (captureMode) {
      // Use captured image
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        alert("Please capture an image first.");
        return;
      }

      // Convert base64 image to Blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      formData.append("file", blob, "captured-image.png");
    } else {
      // Use uploaded file
      if (!file) {
        alert("Please select an image file or capture one using the camera.");
        return;
      }
      formData.append("file", file);
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPrediction(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the image.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCaptureMode = () => {
    setCaptureMode((prevMode) => !prevMode); // Toggle between upload and capture modes
    setImagePreview(null); // Clear any existing preview
    setFile(null); // Clear uploaded file when switching modes
  };

  return (
    <div className="App">
      <h1>Plant Disease Classifier</h1>

      {/* Mode Switcher */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={toggleCaptureMode}>
          {captureMode ? "Switch to Image Upload" : "Switch to Camera Capture"}
        </button>
      </div>

      {/* File Upload or Camera Capture Section */}
      {captureMode ? (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{ width: "100%", maxWidth: "400px", marginBottom: "20px" }}
          />
          <button onClick={() => setImagePreview(webcamRef.current.getScreenshot())}>
            Capture Image
          </button>
        </div>
      ) : (
        <form className="form-container">
          <label htmlFor="image-upload" className="upload-button">
            Choose File
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }} // Hide default file input
          />
        </form>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <img src={imagePreview} alt="Preview" className="image-preview" />
      )}

      {/* Predict Button */}
      {imagePreview && (
        <button
          type="button"
          disabled={loading}
          className="predict-button"
          onClick={handleSubmit}
          style={{ marginTop: "15px" }}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      )}

      {/* Prediction Result */}
      {prediction && (
        <div className="result-box">
          <h2>Prediction Result:</h2>
          <p><strong>Class:</strong> {prediction.class}</p>
          <p><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(2)}%</p>

          {/* Disease Information */}
          {diseaseInfo[prediction.class] && (
            <div>
              <h3>Disease Information:</h3>
              <p><strong>Description:</strong> {diseaseInfo[prediction.class].description}</p>
              <p><strong>Treatment Suggestions:</strong></p>
              <ul>
                {diseaseInfo[prediction.class].treatment.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p><strong>Preventive Measures:</strong></p>
              <ul>
                {diseaseInfo[prediction.class].prevention.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;