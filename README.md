# 🧠 Alzmind — Brain MRI Cognitive Analyzer

AI-powered brain MRI analysis for Alzheimer's risk detection. Built with Claude Vision API + Flask + HTML/CSS/JS.

---

## 📁 Project Structure

```
alzmind/
├── backend/
│   ├── app.py              ← Flask API server
│   ├── requirements.txt    ← Python dependencies
│   └── .env.example        ← Copy to .env and add your API key
└── frontend/
    └── index.html          ← Complete frontend (open in browser)
```

---

## ⚡ Setup in VS Code (Step by Step)

### Step 1 — Get your Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

---

### Step 2 — Open project in VS Code
```bash
# Open the alzmind folder in VS Code
code alzmind/
```

---

### Step 3 — Set up the Backend

Open a terminal in VS Code (`Ctrl + `` ` ``):

```bash
# Go to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
```

Now open `.env` and paste your API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

### Step 4 — Run the Backend

```bash
# Make sure you're in the backend/ folder with venv activated
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

---

### Step 5 — Open the Frontend

Open a **new terminal tab** in VS Code:

```bash
cd frontend
```

**Option A** — Just open the file:
Right-click `index.html` → **Open with Live Server** (install Live Server extension)

**Option B** — Use Python server:
```bash
python -m http.server 3000
```
Then open http://localhost:3000 in your browser.

---

### Step 6 — Test It!

1. Get a sample brain MRI image:
   - Google: "brain MRI axial slice sample image"
   - Download any PNG or JPG
2. Upload it in the app
3. Fill in patient age, symptoms, etc.
4. Click **Analyze Brain MRI →**
5. Report appears in ~5-10 seconds!

---

## 🧪 How to Get Sample MRI Images for Testing

1. **Google Images**: Search "brain MRI Alzheimer's axial sample"
2. **ADNI Dataset** (free, research): https://adni.loni.usc.edu (register for free)
3. **Kaggle MRI datasets**: https://kaggle.com/search?q=brain+mri

---

## 🔧 VS Code Extensions Recommended

Install these for best experience:
- **Live Server** — Opens HTML with hot reload
- **Python** — Python language support
- **REST Client** — Test your API endpoints

---

## 🏗️ How It Works

```
User uploads MRI image (PNG/JPG)
        ↓
Frontend converts to base64
        ↓
POST request to Flask backend (localhost:5000/api/analyze)
        ↓
Backend sends image + patient context to Claude Vision API
        ↓
Claude analyzes MRI → returns structured JSON report
        ↓
Frontend renders: risk level, findings, biomarkers, next steps
```

---

## 🚀 Hackathon Upgrades (if you have time)

| Feature | How to add |
|---|---|
| DICOM support | `pip install pydicom` + convert .dcm → PNG before sending |
| PDF export | Add `jsPDF` CDN to frontend |
| Deepderm (skin) tab | Duplicate frontend tab, change the system prompt |
| Patient history | Add SQLite database to Flask |
| Better auth | Add Flask-Login |

---

## ⚠️ Disclaimer

This is a research/educational project. Not for actual clinical use. Always consult a qualified neurologist.
