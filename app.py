from flask import Flask, request, jsonify, send_from_directory
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io  # Import io module for BytesIO
from flask_cors import CORS  # Import CORS

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load the trained model
model = tf.keras.models.load_model("plant_disease_model(1).h5")

# Define class labels (replace with your actual class names)
class_labels = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato__Target_Spot",
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato__Tomato_mosaic_virus",
    "Tomato_healthy"
]

# Serve React frontend
@app.route('/')
def serve_frontend():
    return send_from_directory('dist', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('dist', path)

@app.route("/predict", methods=["POST"])
def predict():
    # Check if a file was uploaded
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        # Convert FileStorage to BytesIO
        img_bytes = io.BytesIO(file.read())

        # Preprocess the image
        img = image.load_img(img_bytes, target_size=(224, 224))  # Load image from BytesIO
        img_array = image.img_to_array(img) / 255.0              # Normalize pixel values to [0, 1]
        img_array = np.expand_dims(img_array, axis=0)            # Add batch dimension

        # Make prediction
        predictions = model.predict(img_array)
        predicted_class_index = np.argmax(predictions, axis=1)[0]  # Get the predicted class index
        confidence = float(np.max(predictions))                   # Get the confidence score

        # Map the predicted class index to the class label
        predicted_class = class_labels[predicted_class_index]

        # Return result
        return jsonify({
            "class": predicted_class,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(host="0.0.0.0", port=5000)