# CSCA by Apply for China · CSCA Exam Practice & Progress System (中国学术水平能力测试)

An official-style computer-based testing (CBT) practice portal, full-length timed mock examinations, syllabus explorer, AI question generator, mistake notebook, and progress tracking system for the **China Scholastic Competency Assessment (CSCA)** administered under the auspices of the **China Scholarship Council (CSC)**, provided by **CSCA by Apply for China** with a clean, classic Coursera blue design and authentic exam experience.

---

## 1. Threat Summary Table (Agentic Threat Modeling)

| Threat Zone | Identified Risk Scenario | Countermeasure & Implemented Control |
|---|---|---|
| **Input Surfaces** | Malicious injection in AI generation parameters, payload tampering, or malformed JSON imports. | Strict schema validation with null-safe defensive ingestion (`(req.body && typeof req.body === 'object') ? req.body : {}`), bounded numerical inputs (1–10 questions), and payload sanitization via `sanitizePayload`. |
| **Planning & Reasoning** | Prompt injection attempt via customized user queries to bypass syllabus constraints or leak prompt templates. | Strict system instruction framing with strict role demarcation, constrained JSON response schemas (`Type.ARRAY` of `Type.OBJECT`), and deterministic parameterization. |
| **Tool Execution** | SSRF or dynamic code execution during API proxying and question generation. | All external model requests are isolated to internal server-side controllers using the official `@google/genai` SDK with fixed endpoints and no dynamic URLs. |
| **Memory & State** | Cross-candidate state pollution, local storage corruption, or session loss on timeout. | Isolated candidate state schema, strict undefined-stripping prior to state writes, and automatic local JSON export/import for disaster recovery. |
| **Inter-System Communication** | Gemini API key leakage or model unavailability during live testing sessions. | Zero-hardcoding hygiene (`process.env.GEMINI_API_KEY` accessed exclusively server-side) combined with a resilient 4-stage fallback model ladder (`gemini-3.6-flash` → `gemini-3.1-flash-lite` → `gemini-flash-latest` → `gemini-3.7-flash`). |

---

## 2. Core Features & 2025 Syllabus Alignment

- **Official 2025 Syllabi Included**:
  - **Chemistry (CSCA-CHEM-2025)**: 60 min, 48 single-choice MCQs, 100 points. Covers Basic Concepts & Calculations, Properties & Reactions, Chemical Theories, and Experiments & Applications.
  - **Mathematics (CSCA-MATH-2025)**: 60 min, 48 single-choice MCQs, 100 points. Covers Sets & Inequalities, Functions & Calculus, Geometry & Algebra, and Probability & Statistics.
  - **Physics (CSCA-PHYS-2025)**: 60 min, 48 single-choice MCQs, 100 points. Covers Mechanics, Electromagnetism, Thermodynamics, Optics, and Modern Physics.
  - **Chinese (CSCA-CHIN-2025)**: 90 min, 80 single-choice MCQs, 100 points. Covers Science Chinese and Humanities Chinese specialized terminology and academic reading comprehension.
- **Computer-Based Testing (CBT) Console**:
  - Live countdown timer with auto-submit protection.
  - Interactive answer sheet palette (1..48) with answered, unanswered, and flagged status indicators.
  - Dual-language display (English & Simplified Chinese).
- **Progress Tracking & Learning Analytics**:
  - Quantitative radar tracking across all 4 subjects.
  - Syllabus module-level mastery bar charts to identify weak topics.
  - Mistake Notebook (错题本) for automatic capture and targeted drill on failed questions.
- **AI Practice Set Generator & Tutor**:
  - Generates authentic, rigorous CSCA practice questions mapped directly to specific syllabus modules with instant pedagogical breakdowns.

---

## 3. Environment & Prerequisites

1. **Google Cloud SDK**: Ensure `gcloud` CLI is installed and authenticated:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```
2. **Enable Required Google Cloud Services**:
   ```bash
   gcloud services enable \
     run.googleapis.com \
     secretmanager.googleapis.com \
     firestore.googleapis.com \
     cloudbuild.googleapis.com
   ```

---

## 4. Secret Management Setup (Zero-Hardcoding Hygiene)

Create the required operational secret in **Google Cloud Secret Manager** and bind it to the Cloud Run runtime service account:

```bash
# Create and populate the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Grant the default Cloud Run service account access to read the secret
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 5. Database Security Configuration (Cloud Firestore)

When enabling Firestore persistence for candidate accounts, deploy the following owner-bound security rules to ensure user isolation:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profile and candidate data isolation
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Personal test sessions and progress tracking
      match /interactions/{interactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Candidate mistake notebook records
      match /mistakes/{mistakeId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Public official syllabus and question bank metadata
    match /syllabi/{syllabusId} {
      allow read: if true;
      allow write: if false; // Read-only public resource
    }
  }
}
```

---

## 6. Google Cloud Run Deployment Flow

Build and deploy the containerized full-stack application directly using Google Cloud Build and Cloud Run:

```bash
# Build and deploy to Cloud Run with Secret Manager binding
gcloud run deploy csca-quiz-system \
  --source . \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest \
  --set-env-vars=NODE_ENV=production
```

---

## 7. Required Campaign Verification Binding

Apply the mandatory verification resource label to register the deployed Cloud Run service for automated challenge verification:

```bash
gcloud run services update csca-quiz-system \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=asia-southeast1
```

---

## 8. Supabase (PostgreSQL) Database Connection Guide

This application provides built-in support for **Supabase** ("suppose") to persist test attempts, raw student choices, scaled scores, and personal mistake notebooks across devices.

### Step 1: Provision a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create an account.
2. Click **New Project**, choose a project name (e.g. `csca-cbt-portal`) and strong DB password.
3. Once the database is ready (~2 min), navigate to **Project Settings -> API**.
4. Copy the **Project URL** and the **anon (public)** key.

### Step 2: Run the SQL Schema Migration
1. In your Supabase Dashboard, open **SQL Editor** -> **New Query**.
2. Run the SQL schema found in `/SUPABASE_SETUP_GUIDE.md` or directly inside the in-app guide modal (Tab 2: SQL Schema).
3. Verify that 5 tables are created: `profiles`, `exam_papers`, `questions`, `quiz_sessions`, and `mistake_records` with Row Level Security (RLS) enabled.

### Step 3: Connect in the Application
- **Method A (Interactive In-App Modal)**: Click the **[数据库 (Supabase)]** button in the top institutional header ribbon or on the **Progress Dashboard**. Enter your Project URL and Anon API key, click **Save & Test Connection**, then click **Sync Local Exam History & Mistakes Now**.
- **Method B (Environment Variables)**: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env` file before running `npm run build`.

---

## 8.1 Firebase Firestore & Authentication Architecture (Integrated)

This application is officially wired to **Cloud Firestore** and **Firebase Authentication**:
- **Firebase Project ID**: `gen-lang-client-0549142698`
- **Firestore Database ID**: `ai-studio-cscaexamtests-876979f1-6c2e-4c4b-a2a2-1e98ea04e39b`
- **Auth Features**:
  - Email/Password candidate registration & login with CSCA stream selection (Science / Humanities / Both).
  - 1-Click Google Sign-In via Firebase Auth.
  - Automatic persistence of completed test sessions, scaled scores, and mistake notebook entries directly into owner-isolated Firestore subcollections:
    - `/users/{userId}/sessions/{sessionId}`
    - `/users/{userId}/mistakes/{mistakeId}`
- **Security Rules**: Deployed with strict owner-bound rules (`request.auth.uid == userId`) preventing any cross-candidate data leakage.

---

## 9. Functional Stability & Walkthrough Test Matrix

Every user-facing flow has a corresponding verifiable walkthrough test case:

| Test Case ID | Feature & User Flow | Action Steps | Expected Outcome |
|---|---|---|---|
| **TC-01** | **Hero Banner Blue Theme & Quick Drill** | 1. Navigate to Practice Hub (`/`).<br>2. Verify banner is rendered in pure blue theme.<br>3. Click "Daily Drill" (每日速练). | A 10-question mixed warm-up drill opens with a 15-minute countdown and blue interactive answer sheet. |
| **TC-02** | **Official Past Paper Fidelity (Physics Dec 2025)** | 1. Click "Official Papers & Mocks" tab.<br>2. Filter by "Dec 2025" and "Physics".<br>3. Click "Start Real Exam". | Question 1 is verbatim: *"Which of the following physical quantities is not a vector?"* with exact options A. Magnetic induction intensity, B. Momentum, C. Electric field intensity, D. Potential energy, matching authentic booklet. |
| **TC-03** | **Humanities Chinese Past Paper (Dec 2025)** | 1. Filter by "Humanities Chinese" -> Dec 2025.<br>2. Start exam. | Question 1 is verbatim: *"年复⼀年的电视直播，并不总有新鲜、刺激的内容..."* with exact 4 options and 80-question sequence. |
| **TC-04** | **Science Chinese Past Paper (Mar 2026)** | 1. Filter by "Science Chinese" -> Mar 2026.<br>2. Start exam. | Question 1 is *"“这个实验的结果测量得很准，误差很⼩。”句中的“量”怎么读？"* with options A. liáng, B. liàng, C. liang, D. lián. |
| **TC-05** | **CBT Time Countdown & Auto-Grading** | 1. Start any exam.<br>2. Answer 5 questions, flag 1 question.<br>3. Click "Review & Submit" (交卷). | Modal displays answered vs unanswered count. Submitting computes official 100-point scale score, accuracy percentage, and generates detailed question review. |
| **TC-06** | **Mistake Notebook Capture & Re-Drill** | 1. Submit an exam with 1 incorrect answer.<br>2. Open "Mistake Book" (错题本) tab. | The failed question is automatically captured with incorrect choice vs correct option and bilingual explanation. User can click "Practice Missed Questions" to re-drill. |
| **TC-07** | **Front-Page Direct Sign-In & Mistake Isolation** | 1. Navigate to front page (`/`).<br>2. Fill in Email and Password directly on the front-page Sign-in card (or click "Sign In with Google").<br>3. Click "Sign in". | Candidate is authenticated immediately (auto-registers if first-time user, eliminating separate create account tabs). Firestore connects securely. Candidate starts with 0 mistakes, and all mistakes recorded are strictly isolated to this candidate. |
| **TC-08** | **Firestore Real-Time Test Session Sync** | 1. Sign in with candidate account.<br>2. Complete a CSCA exam or drill and submit.<br>3. Open Progress Dashboard. | Session is automatically stored in `/users/{userId}/sessions` in Firestore. Cloud sync indicator verifies write confirmation. |
| **TC-09** | **Supabase Connection & Live Ping** | 1. Click **[数据库 (Supabase)]** in Header.<br>2. Open "3. Test Connection" tab.<br>3. Enter Supabase URL and Key.<br>4. Click "Save & Test Connection". | System executes live ping against Supabase, measures roundtrip latency (ms), displays green confirmation, and enables 1-click cloud sync. |

---

## 10. Local Development

```bash
# Install dependencies
npm install

# Start full-stack development server (Express backend + Vite client)
npm run dev

# Run TypeScript linter
npm run lint

# Build for production
npm run build
```

---

## 11. DigitalOcean Deployment Flow

This project includes a multi-stage `Dockerfile` and `.dockerignore` optimized for DigitalOcean.

### Option A: DigitalOcean App Platform (Recommended)
1. Push this repository to GitHub or GitLab.
2. In DigitalOcean Console, click **Create > Apps** and connect your repository.
3. Select **Web Service** with HTTP Port `8080`.
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `8080`
   - `GEMINI_API_KEY`: `your_gemini_api_key_here` (marked as Secret)
   - `VITE_SUPABASE_URL`: `your_supabase_project_url`
   - `VITE_SUPABASE_ANON_KEY`: `your_supabase_anon_key`
5. DigitalOcean will automatically build and deploy with auto-renewing SSL/TLS certificates.


