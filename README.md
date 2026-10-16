# CSCA Exam Practice & Progress Tracking System (中国学术水平能力测试)

An official-style computer-based testing (CBT) practice portal, full-length timed mock examinations, syllabus explorer, AI question generator, mistake notebook, and progress tracking system for the **China Scholastic Competency Assessment (CSCA)** administered under the auspices of the **China Scholarship Council (CSC)**.

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
  - **Professional Chinese (CSCA-CHIN-2025)**: 90 min, 80 single-choice MCQs, 100 points. Covers STEM and Humanities specialized terminology and academic reading comprehension.
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

## 8. Local Development

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

## 9. DigitalOcean Deployment Flow

This project includes a multi-stage `Dockerfile` and `.dockerignore` optimized for DigitalOcean.

### Option A: DigitalOcean App Platform (Recommended)
1. Push this repository to GitHub or GitLab.
2. In DigitalOcean Console, click **Create > Apps** and connect your repository.
3. Select **Web Service** with HTTP Port `8080`.
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `8080`
   - `GEMINI_API_KEY`: `your_gemini_api_key_here` (marked as Secret)
5. DigitalOcean will automatically build and deploy with auto-renewing SSL/TLS certificates.

### Option B: DigitalOcean Droplet (Docker)
1. Launch an Ubuntu Droplet and install Docker:
   ```bash
   sudo apt update && sudo apt install -y docker.io git
   ```
2. Clone your repository, build, and run the container:
   ```bash
   git clone <YOUR_REPO_URL>
   cd csca-quiz-system
   docker build -t csca-quiz .
   docker run -d --name csca-quiz --restart always -p 80:8080 \
     -e GEMINI_API_KEY="your_gemini_api_key_here" \
     -e NODE_ENV="production" \
     csca-quiz
   ```

