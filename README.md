# Plant-Disease-Prediction
This project is a web-based system designed to identify plant diseases from images of leaves using deep learning. It integrates a lightweight convolutional neural network with a responsive frontend interface, allowing users to upload images and receive instant predictions.
The backend uses a MobileNetV2-based model trained through transfer learning to classify images into multiple plant disease categories. The system is built using React.js for the frontend and Flask for the backend, with Docker-based deployment on AWS EC2 for scalable and real-time usage.
The primary goal is to support early detection of plant diseases, making this tool useful for farmers, agricultural researchers, and agri-tech applications.

**Tools and Libraries:**

TensorFlow & Keras – For building and training the deep learning model

MobileNetV2 – Lightweight CNN architecture used with transfer learning

Flask – Python backend serving predictions through RESTful APIs

React.js – Frontend framework for user interaction and image upload

Docker – Containerization of the backend for consistent deployment

AWS EC2 – Cloud hosting of the application for scalable access

**Getting Started**
1. Clone the Repository- Downloads the full project to your machine.
git clone https://github.com/yourusername/plant-disease-prediction.git
cd plant-disease-prediction

2. Set Up the Backend
python -m venv venv                
source venv/bin/activate           
pip install -r requirements.txt    
python app.py                      
Runs the backend at http://localhost:5000, where predictions will be served.

3. Set Up the Frontend 
cd frontend/plant_ui
npm install                        
npm run dev                        
Launches the React app at http://localhost:5173 

4. Run the Backend Using Docker
docker build -t plant-backend .    
docker run -p 5000:5000 plant-backend
This runs the backend inside a Docker container instead of your local Python environment.



