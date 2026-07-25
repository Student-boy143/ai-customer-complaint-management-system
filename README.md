#  AI-Powered Customer Complaint Management System

An intelligent complaint management platform that automates customer complaint processing using AI. The system extracts structured information from complaint documents (PDF, Images, and EML), classifies complaints, assigns priority, and streamlines complaint management through an AI-assisted workflow.

---

##  Features

### Complaint Management
- Create, Read, Update, and Delete (CRUD) complaints
- Complaint dashboard with status tracking
- Search and filter complaints
- Complaint categorization
- Priority management

### AI-Powered Features
- Upload complaint documents
- Support for:
  - PDF
  - PNG
  - JPG/JPEG
  - EML
- - OCR-based text extraction from scanned images and PDF documents
- AI-powered complaint information extraction using Groq LLM
- LangGraph workflow for complaint processing
- Automatic form auto-fill
- AI-generated complaint summary
- Automatic complaint priority assignment

### AI Workflow

```
Upload File
      │
      ▼
Extract Text
      │
      ▼
Groq AI Extraction
      │
      ▼
LangGraph Workflow
      │
      ▼
Validate Fields
      │
      ▼
Generate Summary
      │
      ▼
Assign Priority
      │
      ▼
Auto-fill Complaint Form
```

---

#  Tech Stack

## Frontend

- React.js
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS

## Backend

- FastAPI
- SQLAlchemy
- Pydantic
- LangGraph
- Groq API

## Database

- MySQL

## AI & NLP

- Groq LLM
- LangGraph
- pdfplumber
- Pillow
- pytesseract
- Python email parser

---

#  Project Structure

```
backend/
│
├── app/
│   ├── api/
│   ├── ai/
│   ├── core/
│   ├── database/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   └── main.py
│
├── uploads/
├── tests/
├── requirements.txt
└── .env

frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── services/
│   └── App.jsx
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Student-boy143/ai-customer-complaint-management-system.git
cd ai-customer-complaint-management-system
```

---

## Backend Setup

Create a virtual environment

```bash
python -m venv venv
```

Activate environment

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/complaints_db

GROQ_API_KEY=your_groq_api_key
```

Run backend

```bash
uvicorn app.main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

```bash
npm install
```

Run

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

#  How It Works

1. Upload a complaint document.
2. System extracts text.
3. Groq AI extracts structured complaint information.
4. LangGraph validates and processes the complaint.
5. Complaint details automatically populate the form.
6. User reviews extracted information.
7. Complaint is stored in the database.
8. Complaint can later be viewed and edited from the dashboard.

---

#  Screenshots

| Home | Dashboard |
|------|-----------|
| ![](screenshots/home.png) | ![](screenshots/dashboard.png) |

| AI Upload | Auto-filled Form |
|-----------|------------------|
| ![](screenshots/upload.png) | ![](screenshots/extracted.png) |

| Edit Complaint | Swagger |
|----------------|----------|
| ![](screenshots/edit.png) | ![](screenshots/swagger.png) |

---

#  Supported File Types

| File Type | Supported |
|-----------|-----------|
| PDF | ✅ |
| PNG | ✅ |
| JPG | ✅ |
| JPEG | ✅ |
| EML | ✅ |

---

#  AI Components

- Document Upload
- OCR/Text Extraction
- Complaint Information Extraction
- Complaint Classification
- Priority Detection
- AI Summary Generation
- LangGraph Workflow

---

# API Endpoints

## Complaint APIs

```
GET     /api/complaints
POST    /api/complaints
GET     /api/complaints/{id}
PUT     /api/complaints/{id}
DELETE  /api/complaints/{id}
```

## AI APIs

```
POST /api/upload
POST /api/ai/extract
POST /api/workflow/complaint
```

---

# Future Enhancements

- Persist AI-generated summaries in the database
- AI-generated response suggestions
- Duplicate complaint detection
- Sentiment analysis
- Email notifications
- Authentication & authorization
- Cloud storage for uploaded documents
- Complaint analytics dashboard

---

# Author

**Ramesh Patel**

Computer Engineering Student  
K J Somaiya School of Engineering

GitHub: https://github.com/Student-boy143

LinkedIn: https://www.linkedin.com/in/ramesh-patel-3a8493323/