# CrimeSceneSolver

AI-powered forensic investigation platform that analyzes crime scene images using deep learning and helps investigators detect evidence and predict possible crime scenarios.

## Features

- **Image Upload**: Drag and drop crime scene images for analysis
- **AI Analysis**: Deep learning-powered crime classification and evidence detection
- **Evidence Detection**: Automatic identification of potential evidence items
- **Crime Classification**: Predict crime types with confidence scores
- **Case Management**: Store and track investigation cases
- **Dashboard**: Analytics and visualization of investigation data
- **PDF Reports**: Generate comprehensive forensic reports
- **Responsive Design**: Professional forensic investigation interface

## Technology Stack

### Frontend
- HTML5
- TailwindCSS
- JavaScript (ES6+)
- Chart.js

### Backend
- Node.js
- Express.js
- Mongoose
- Multer
- CORS
- dotenv
- PDFKit

### AI Engine
- Python
- PyTorch
- CLIP Vision Model (ViT-B/32)
- OpenCV
- NumPy
- Pillow

### Database
- MongoDB

### Testing
- Jest
- Supertest

## Installation

### Prerequisites
- Node.js (>=14.0.0)
- Python (>=3.8)
- MongoDB
- pip

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CrimeSceneSolver
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start MongoDB**
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   mongod
   ```

## Running the System

1. **Start the backend server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

2. **Open the frontend**
   Navigate to `http://localhost:3000` in your browser

## Usage

1. **Start Investigation**: Click "Start Investigation" on the landing page
2. **Upload Image**: Drag and drop or browse for a crime scene image
3. **AI Analysis**: The system automatically analyzes the image
4. **View Results**: Review crime prediction, confidence, and detected evidence
5. **Save Case**: Store investigation results in the database
6. **Generate Report**: Create PDF forensic reports
7. **Track Cases**: View case history and analytics on the dashboard

## AI Pipeline

The AI module performs the following steps:

1. **Load CLIP Model**: ViT-B/32 vision model using PyTorch
2. **Preprocess Image**: Resize, normalize, and enhance using Pillow and OpenCV
3. **Crime Classification**: Use CLIP to classify crime categories
4. **Evidence Detection**: Apply OpenCV-based object detection
5. **Return Results**: JSON response with predictions and evidence

### Crime Categories
- homicide
- robbery
- assault
- kidnapping
- drug crime

### Evidence Types
- knife
- gun
- blood
- drugs
- broken glass

## API Endpoints

### Analysis
- `POST /api/analyze` - Upload and analyze crime scene image

### Cases
- `GET /api/cases` - Get all investigation cases
- `GET /api/cases/:caseId` - Get specific case details
- `POST /api/cases` - Save new investigation case
- `DELETE /api/cases/:caseId` - Delete investigation case

### Reports
- `POST /api/report` - Generate PDF forensic report

## Database Schema

### Case Model
```javascript
{
  caseId: String (unique),
  images: [String],
  prediction: String (enum: crime categories),
  confidence: Number (0-1),
  evidenceDetected: [String] (enum: evidence types),
  createdAt: Date
}
```

## Testing

Run the automated test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
CrimeSceneSolver/
├── client/                 # Frontend files
│   ├── index.html         # Landing page
│   ├── dashboard.html     # Dashboard
│   ├── upload.html        # Image upload
│   ├── results.html       # Analysis results
│   ├── cases.html         # Case management
│   ├── styles.css         # Custom styles
│   └── app.js            # Frontend JavaScript
├── server/                # Backend server
│   └── server.js         # Express server
├── routes/                # API routes
│   ├── crimeRoutes.js    # Analysis endpoints
│   └── caseRoutes.js     # Case management
├── controllers/           # Request handlers
│   ├── crimeController.js
│   └── caseController.js
├── models/                # Database models
│   └── Case.js           # Case schema
├── middleware/            # Express middleware
│   └── uploadMiddleware.js
├── services/              # Business logic
│   ├── pythonService.js  # Node-Python communication
│   └── reportService.js  # PDF generation
├── ai/                    # Python AI engine
│   ├── analyze.py        # Main analysis script
│   ├── model_loader.py   # CLIP model loading
│   ├── evidence_detection.py
│   └── preprocess.py     # Image preprocessing
├── config/                # Configuration
│   └── db.js             # Database connection
├── tests/                 # Test files
│   └── api.test.js       # API tests
├── uploads/               # Uploaded images
├── uploads/reports/       # Generated reports
├── package.json           # Node dependencies
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
└── README.md              # This file
```

## Environment Variables

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/crimescenesolver
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository.

---

**CrimeSceneSolver** - Advanced AI for forensic investigation
