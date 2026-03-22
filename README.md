📄 CrimeSolver – AI Crime Scene Analysis System

📌 Overview

CrimeSolver is an AI-powered system that analyzes crime scene images and predicts possible crime scenarios. Users upload an image, and the system processes it using an AI vision model to return likely crime classifications with confidence scores.

This project demonstrates the integration of web technologies and artificial intelligence for automated crime scene analysis.

🚀 Features

* Upload crime scene images

* AI-based scene classification

* Confidence score predictions

* REST API backend

* Node.js ↔ Python AI integration

* MongoDB data storage

* Supports multiple image testing

🧰 Technologies Used
🎨 Frontend:

HTML, CSS, JavaScript (basic interface)

Postman (API testing)

⚙ Backend:
Server & API

Node.js

Express.js

Mul­ter (file uploads)

dotenv

CORS

AI & Processing:

Python

CLIP (ViT-B/32) Vision Model

PyTorch

NumPy

Database:

MongoDB

Mongoose

📁 Project Structure
CrimeSolver/
│
├── client/          # frontend (optional)
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── ai/
│   ├── uploads/
│   └── server.js
│
├── samples/         # test images
├── package.json
└── README.md

⚙ Installation & Setup:

1️⃣ Clone or Download Project
git clone <repo-url>
cd CrimeSolver

2️⃣ Install Backend Dependencies
cd server
npm install

3️⃣ Setup Python Environment

Create virtual environment:

python -m venv .venv

Activate environment:

Windows (Git Bash):

source .venv/Scripts/activate

Install required Python packages:

pip install torch numpy pillow
4️⃣ Configure Environment Variables

Create .env file inside server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string

5️⃣ Start the Server
cd server
node server.js

You should see:

Server running on port 5000
MongoDB Connected
🧪 Testing the API
✅ Using Postman

POST request:

http://localhost:5000/api/crime/analyze

Body → form-data

Key: image
Type: File
Upload an image.

✅ Using curl (terminal)
curl -X POST http://localhost:5000/api/crime/analyze \
  -F "image=@server/datasets/sample.jpg"

📊 Sample Output
{
  "message": "Analysis complete",
  "analysis": {
    "engine": "CLIP ViT-B/32",
    "predictions": [
      { "label": "homicide", "score": 0.82 }
    ]
  }
}
🧠 How It Works

* User uploads an image

* Server receives & stores the image

* Python AI module analyzes the scene

* CLIP model predicts crime type

* Results returned as JSON response

📌 Use Cases

* Crime scene investigation support

* Law enforcement assistance tools

* AI-based forensic analysis

* Research in computer vision applications

🔮 Future Improvements

* Web interface for real-time results

* Mobile application integration

* Expanded crime classification categories

* Real-time camera feed analysis

* Cloud deployment

