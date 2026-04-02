# Sonic Pinnacle: Advancing Age-Linked Speech Analysis through AI

This repository contains my Bachelor’s Final Year Thesis project (BSc Electrical Engineering): an AI-based system for age-linked child speech analysis.

For my Master’s applications, this repository is the public technical evidence of the thesis work. It includes the thesis report, implementation code, and runnable demos.

## Academic Context

- **Thesis title:** Sonic Pinnacle: Advancing Age-Linked Speech Analysis through AI  
- **Degree context:** Bachelor of Science (Electrical Engineering)  
- **Project type:** Final Year Thesis (team project with defined individual technical contributions)

## What the Project Does

The system predicts a child speech-age category from an audio sample. The pipeline is:

1. Input speech audio (`.wav`, uploaded or recorded)
2. Audio preprocessing with Mel-spectrogram generation
3. Deep learning inference using a trained TensorFlow/Keras model (`final_model.h5`)
4. Class prediction with confidence score
5. Reporting in web UI and optional data persistence (Firebase path)

## Repository Structure

```text
.
├── Final Year Thesis - BSc Electrical Engineering.pdf   # Full thesis report
├── my-app/                                               # React + Vite frontend
├── server/                                               # Flask inference API
└── Gradio-App/                                           # Standalone Gradio demo (+ chatbot)
```

## Main Components

### 1) React + Flask application (primary full-stack workflow)

- **Frontend:** `my-app/` (React, Vite, Firebase, dashboard/reporting UI)
- **Backend:** `server/` (Flask API endpoint for prediction)
- **Core endpoint:** `POST /predict`

### 2) Gradio application (standalone demo workflow)

- `Gradio-App/` provides a simplified demo with:
  - speech prediction interface
  - chatbot-assisted interaction

## Technology Stack

- **Frontend:** React, Vite, React Router, Firebase, Tailwind/MUI
- **Backend:** Flask, Flask-CORS
- **ML/Audio:** TensorFlow/Keras, librosa, NumPy, matplotlib
- **Demo UI:** Gradio

## Data & Output Flow

For the React + Flask path:

1. User authenticates in web app
2. User uploads/records child speech sample
3. Frontend sends file to Flask model API
4. API returns predicted class and confidence
5. Frontend stores result metadata (Firestore/Storage, when configured)
6. Reports are rendered in dashboard views

## How to Run

## A) Run Flask backend

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Backend default: `http://127.0.0.1:5000`

## B) Run React frontend

```bash
cd my-app
npm install
npm run dev
```

Frontend default: `http://localhost:5173`

## C) Run Gradio demo (optional)

```bash
cd Gradio-App
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Environment Configuration

You should configure credentials via environment variables (recommended for secure use):

- Firebase config values for `my-app`
- Generative AI API key for chatbot-enabled components

Avoid committing plaintext keys to source control.

## Evidence for Admissions Review

This repository is intended to support thesis verification for graduate applications.

Included evidence:

- Full thesis document (`Final Year Thesis - BSc Electrical Engineering.pdf`)
- Source code for model-serving backend and user-facing applications
- Reproducible run instructions

My transcript, CV, motivation documents, and formal module mappings are maintained separately in application documents and can be provided where required.

## Contribution Note

This thesis was completed as a team academic project. This repository documents my implementation-focused contributions, including application integration, model-serving workflow, and deployment-oriented prototype interfaces.

## Current Status

Active academic project archive. The repository is being maintained for documentation quality, reproducibility, and graduate-application evidence.

## Thesis Link

A dedicated public thesis/project link will be added after the next GitHub push/update.
