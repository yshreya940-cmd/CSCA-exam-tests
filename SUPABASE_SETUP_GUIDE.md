# Complete Step-by-Step Guide: Connecting CSCA Examination Portal to Supabase (PostgreSQL)

This guide provides end-to-end instructions for connecting this web portal to your **Supabase** ("suppose") database.

---

## Overview

When connected to Supabase:
1. **Candidate Profiles (`profiles`)**: Lifetime study streaks, lifetime questions answered, accuracy rate, and CSC scholar target universities are persisted to PostgreSQL.
2. **Quiz & Exam Records (`quiz_sessions`)**: Full-length 60/90 minute CBT exam submissions, raw answers, scores, timestamps, and question-by-question breakdown are saved.
3. **Mistake Notebook (`mistake_records`)**: All incorrect choices and flagged questions are saved to PostgreSQL with review counts and mastery flags.
4. **Questions & Exam Papers (`exam_papers`, `questions`)**: Catalog of official papers and practice questions.

---

## Step 1: Create a Free Supabase Project

1. Visit [https://supabase.com](https://supabase.com) and click **Start your project** or sign in.
2. Click **New Project** and select your organization.
3. Enter project settings:
   - **Name**: `csca-exam-portal`
   - **Database Password**: Set a strong password (save this safely).
   - **Region**: Choose a region closest to your users (e.g., `Singapore`, `Tokyo`, or `Frankfurt`).
4. Click **Create new project** and wait ~2 minutes for PostgreSQL to provision.

---

## Step 2: Retrieve Your API Credentials

In the left navigation sidebar of your Supabase dashboard:
1. Click the gear icon at the bottom (**Project Settings**).
2. Click **API** under the Configuration section.
3. You will see two essential credentials:
   - **Project URL**: e.g. `https://xyzcompanyabcdef.supabase.co`
   - **Project API Keys** -> `anon` / `public`: e.g. `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## Step 3: Run the Database Migration (SQL Schema)

1. In the Supabase left navigation sidebar, click **SQL Editor**.
2. Click **New Query**.
3. Copy and paste the complete SQL script below into the editor, then click **Run**:

```sql
-- ========================================================
-- CSCA by Apply for China — Production Supabase Schema
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id TEXT UNIQUE NOT NULL,
  candidate_name TEXT NOT NULL,
  email TEXT,
  application_type TEXT DEFAULT 'CGS',
  target_university TEXT,
  registered_subjects TEXT[] DEFAULT '{}',
  streak_days INTEGER DEFAULT 1 CHECK (streak_days >= 0),
  last_active_date DATE DEFAULT CURRENT_DATE,
  total_questions_attempted INTEGER DEFAULT 0 CHECK (total_questions_attempted >= 0),
  total_correct INTEGER DEFAULT 0 CHECK (total_correct >= 0),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Exam Papers Catalog
CREATE TABLE IF NOT EXISTS public.exam_papers (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  subject TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  year TEXT NOT NULL,
  session_month TEXT NOT NULL,
  exam_paper_tag TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_zh TEXT NOT NULL,
  is_mock BOOLEAN DEFAULT false,
  track TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Central Questions Repository
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  module TEXT NOT NULL,
  subtopic TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Standard',
  exam_paper TEXT,
  question_number INTEGER,
  section TEXT,
  question_en TEXT NOT NULL,
  question_zh TEXT NOT NULL,
  options_en JSONB NOT NULL,
  options_zh JSONB NOT NULL,
  correct_option SMALLINT NOT NULL CHECK (correct_option BETWEEN 0 AND 5),
  explanation_en TEXT NOT NULL,
  explanation_zh TEXT NOT NULL,
  formula TEXT,
  syllabus_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Quiz Sessions History
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL,
  paper_id TEXT,
  exam_paper_name TEXT,
  subject TEXT NOT NULL,
  mode TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  time_limit_seconds INTEGER NOT NULL,
  time_spent_seconds INTEGER NOT NULL,
  score INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  incorrect_count INTEGER NOT NULL,
  unanswered_count INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  user_answers JSONB DEFAULT '{}'::jsonb,
  flagged_questions JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Mistake Records
CREATE TABLE IF NOT EXISTS public.mistake_records (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  module TEXT NOT NULL,
  user_choice SMALLINT,
  correct_option SMALLINT NOT NULL,
  resolved BOOLEAN DEFAULT false,
  review_count INTEGER DEFAULT 1,
  added_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistake_records ENABLE ROW LEVEL SECURITY;

-- 7. RLS Access Policies
DROP POLICY IF EXISTS "Public can view exam papers" ON public.exam_papers;
CREATE POLICY "Public can view exam papers" ON public.exam_papers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view questions" ON public.questions;
CREATE POLICY "Public can view questions" ON public.questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon upsert profiles" ON public.profiles;
CREATE POLICY "Allow anon upsert profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon insert sessions" ON public.quiz_sessions;
CREATE POLICY "Allow anon insert sessions" ON public.quiz_sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon manage mistakes" ON public.mistake_records;
CREATE POLICY "Allow anon manage mistakes" ON public.mistake_records FOR ALL USING (true) WITH CHECK (true);
```

4. You should see `Success. No rows returned` in green. Click **Table Editor** on the left menu to verify that `profiles`, `exam_papers`, `questions`, `quiz_sessions`, and `mistake_records` are visible.

---

## Step 4: Configure the Application

You have two convenient ways to connect:

### Method A: Direct in the Application UI (No Code Changes Needed!)
1. Open the CSCA Examination Portal website.
2. In the top institutional navigation ribbon (or on the Analytics tab), click the button:
   `[数据库 (Supabase)]` / `[Database]`
3. Switch to the **3. 联调测试与数据同步 (Test & Sync)** tab.
4. Paste your **Project URL** and **Anon Public API Key**.
5. Click **保存并测试连接 (Save & Test Connection)**.
6. The system will ping Supabase, show real-time roundtrip latency, and display:
   `✅ 连接测试通过 (Connection Successful)`.
7. Click **立即同步本地历史答卷与错题至 Supabase (Sync Local Exam History & Mistakes Now)** to upload all existing mock attempts and mistakes immediately.

### Method B: Environment Variables (`.env`)
1. In the root directory of the application, open or create `.env`:
   ```bash
   PORT=3000
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
2. Restart the application or build for production (`npm run build`).

---

## Step 5: Verification Checklist

1. **Test Connection in UI**: Click the Database button in the header -> Enter credentials -> Click "Save & Test Connection". Ensure green confirmation appears.
2. **Automatic Exam Persistence**: Start any 48-question exam (e.g. Mathematics Jan 2026 or Physics Dec 2025), answer questions, and click "Submit Exam".
3. **Inspect in Supabase Dashboard**: Go to **Table Editor** -> `quiz_sessions`. Verify the new row appears with your exact scaled score, accuracy, and question answers!
4. **Inspect Mistake Notebook**: Miss a question intentionally, submit, then check `mistake_records` in Supabase. The missed item is saved with the correct option and syllabus module tag.
