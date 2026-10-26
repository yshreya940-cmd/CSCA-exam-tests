# CSCA Examination Platform — Supabase Database Architecture & Schema Specification

This document provides a comprehensive database specification and production-ready SQL migration script for integrating **Supabase (PostgreSQL)** into the **CSCA by Apply for China** Computer-Based Testing (CBT) portal.

---

## 1. Entity-Relationship Overview

```
                      +-------------------+
                      |   auth.users      |
                      | (Supabase Auth)   |
                      +---------+---------+
                                | 1:1
                                v
                      +-------------------+
                      |     profiles      |
                      +---+-----------+---+
                          | 1:N       | 1:N
           +--------------+           +---------------+
           |                                          |
           v                                          v
+-------------------+                      +-------------------+
|   quiz_sessions   |                      |  mistake_records  |
+---------+---------+                      +---------+---------+
          | N:1                                      | N:1
          v                                          v
+-------------------+                      +-------------------+
|    exam_papers    |                      |     questions     |
+---------+---------+                      +---------+---------+
          | 1:N                                      ^
          +------------------------------------------+ (N:1)
```

---

## 2. Table Specifications

### Table 1: `profiles`
Stores candidate account details, admission stream, and overarching academic KPIs. Links 1:1 with `auth.users`.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, `REFERENCES auth.users(id) ON DELETE CASCADE` | Matches the authenticated user's ID. |
| `candidate_id` | `TEXT` | `UNIQUE NOT NULL` | CSCA Candidate Registration Code (e.g., `CSCA-2026-8841`). |
| `candidate_name` | `TEXT` | `NOT NULL` | Full Name / English Name of candidate. |
| `email` | `TEXT` | `NOT NULL` | Contact email address. |
| `application_type` | `TEXT` | `DEFAULT 'CGS'` | Scholarship Track: `'CGS'`, `'Self-Funded'`, or `'University-Direct'`. |
| `target_university` | `TEXT` | `NULLABLE` | Dream Chinese University (e.g., Tsinghua, Peking Univ, Fudan). |
| `registered_subjects` | `TEXT[]` | `DEFAULT '{}'` | Array of chosen subjects: `['Mathematics', 'Physics', 'Chemistry', 'Chinese']`. |
| `streak_days` | `INTEGER` | `DEFAULT 1 CHECK (streak_days >= 0)` | Consecutive daily study streak. |
| `last_active_date` | `DATE` | `DEFAULT CURRENT_DATE` | Date of last quiz activity. |
| `total_questions_attempted` | `INTEGER` | `DEFAULT 0 CHECK (total_questions_attempted >= 0)` | Lifetime attempted questions across all modes. |
| `total_correct` | `INTEGER` | `DEFAULT 0 CHECK (total_correct >= 0)` | Lifetime correct responses. |
| `created_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Account creation timestamp. |
| `updated_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Last profile update timestamp. |

---

### Table 2: `exam_papers`
Catalog of official past exam papers and timed mock sets across all sessions.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT` | `PRIMARY KEY` | Unique paper slug (e.g., `math-jan-2026`, `phys-dec-2025`). |
| `name_en` | `TEXT` | `NOT NULL` | Official paper title in English. |
| `name_zh` | `TEXT` | `NOT NULL` | Official paper title in Simplified Chinese. |
| `subject` | `TEXT` | `NOT NULL` | `'Mathematics'`, `'Physics'`, `'Chemistry'`, `'Science Chinese'`, `'Humanities Chinese'`. |
| `total_questions` | `INTEGER` | `NOT NULL` | Standard question count (48 for STEM, 80 for Chinese). |
| `duration_minutes` | `INTEGER` | `NOT NULL` | CBT Time limit (60 min for STEM, 90 min for Chinese). |
| `year` | `TEXT` | `NOT NULL` | Examination year (e.g., `'2025'`, `'2026'`). |
| `session_month` | `TEXT` | `NOT NULL` | Session tag: `'Jan 2026'`, `'Mar 2026'`, `'Apr 2026'`, `'Dec 2025'`. |
| `exam_paper_tag` | `TEXT` | `NOT NULL` | System grouping tag (e.g., `'January 2026 Official Exam'`). |
| `description_en` | `TEXT` | `NOT NULL` | 1-line syllabus & topic overview in English. |
| `description_zh` | `TEXT` | `NOT NULL` | 1-line syllabus & topic overview in Chinese. |
| `is_mock` | `BOOLEAN` | `DEFAULT false` | `true` if configured for timed mock track practice. |
| `track` | `TEXT` | `NULLABLE` | `'Science'` or `'Humanities'`. |
| `created_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Record created timestamp. |

---

### Table 3: `questions`
Central question repository containing authentic past examination questions and AI tutor practice items.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT` | `PRIMARY KEY` | Unique Question ID (e.g., `MATH_2026_JAN_001`). |
| `subject` | `TEXT` | `NOT NULL` | Subject code/name. |
| `module` | `TEXT` | `NOT NULL` | Syllabus module title (e.g., `'Sets & Inequalities'`). |
| `subtopic` | `TEXT` | `NOT NULL` | Specific subtopic (e.g., `'Quadratic Inequalities'`). |
| `difficulty` | `TEXT` | `DEFAULT 'Standard'` | `'Standard'`, `'Challenging'`, or `'Advanced'`. |
| `question_en` | `TEXT` | `NOT NULL` | Full question stem in English. |
| `question_zh` | `TEXT` | `NOT NULL` | Full question stem in Simplified Chinese. |
| `options_en` | `JSONB` | `NOT NULL` | Array of 4 option strings: `["A", "B", "C", "D"]`. |
| `options_zh` | `JSONB` | `NOT NULL` | Array of 4 option strings in Chinese. |
| `correct_option` | `SMALLINT`| `NOT NULL CHECK (correct_option BETWEEN 0 AND 3)` | Zero-indexed correct choice index (0=A, 1=B, 2=C, 3=D). |
| `explanation_en` | `TEXT` | `NOT NULL` | Step-by-step derivation & distractor analysis in English. |
| `explanation_zh` | `TEXT` | `NOT NULL` | Step-by-step derivation in Simplified Chinese. |
| `formula` | `TEXT` | `NULLABLE` | Key mathematical/chemical formula in LaTeX format. |
| `syllabus_ref` | `TEXT` | `NULLABLE` | Official CSCA syllabus clause (e.g., `MATH-1.2.3`). |
| `exam_paper_id` | `TEXT` | `NULLABLE REFERENCES exam_papers(id)` | Paper identifier if sourced from an official exam. |
| `question_number` | `INTEGER` | `NULLABLE` | Original sequence number in official exam (1..48 or 1..80). |
| `section` | `TEXT` | `NULLABLE` | Chinese exam section (e.g., `'识解汉字'`, `'学术阅读'`). |
| `created_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Insertion timestamp. |

---

### Table 4: `quiz_sessions`
Full audit trail of every candidate CBT exam attempt, daily drill, or topic practice.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique session attempt ID. |
| `user_id` | `UUID` | `NOT NULL REFERENCES profiles(id) ON DELETE CASCADE` | Candidate who took the test. |
| `mode` | `TEXT` | `NOT NULL` | `'past_paper'`, `'mock'`, `'daily'`, `'topic'`, `'ai'`, `'mistake'`. |
| `subject` | `TEXT` | `NOT NULL` | Subject tested. |
| `paper_id` | `TEXT` | `NULLABLE REFERENCES exam_papers(id)` | Paper taken (if past paper or timed mock). |
| `exam_paper_name`| `TEXT` | `NULLABLE` | Human-readable name of exam paper. |
| `module_title` | `TEXT` | `NULLABLE` | Filtered module title (for topic drills). |
| `total_questions`| `INTEGER` | `NOT NULL` | Total number of questions in session. |
| `time_limit_seconds`| `INTEGER` | `DEFAULT 0` | Allotted duration in seconds (0 for untimed). |
| `time_spent_seconds`| `INTEGER` | `DEFAULT 0` | Total seconds candidate took to finish. |
| `user_answers` | `JSONB` | `DEFAULT '{}'::jsonb` | Map of `{ questionIndex: selectedOptionIndex }`. |
| `flagged_questions`| `JSONB` | `DEFAULT '{}'::jsonb` | Map of `{ questionIndex: boolean }` review markers. |
| `is_completed` | `BOOLEAN` | `DEFAULT false` | Whether exam was finalized and scored. |
| `score` | `NUMERIC(5,2)` | `DEFAULT 0.00` | Scaled score (0 to 100 points). |
| `correct_count` | `INTEGER` | `DEFAULT 0` | Total correct answers. |
| `incorrect_count`| `INTEGER` | `DEFAULT 0` | Total incorrect answers. |
| `unanswered_count`| `INTEGER`| `DEFAULT 0` | Total questions left blank. |
| `accuracy` | `NUMERIC(5,2)` | `DEFAULT 0.00` | Accuracy percentage (0.00 to 100.00%). |
| `started_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Session start time. |
| `completed_at` | `TIMESTAMPTZ`| `NULLABLE` | Session submission time. |

---

### Table 5: `mistake_records`
Personal Mistake Notebook (错题本) with spaced-repetition resolution tracking.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique mistake record ID. |
| `user_id` | `UUID` | `NOT NULL REFERENCES profiles(id) ON DELETE CASCADE` | Candidate ID. |
| `question_id` | `TEXT` | `NOT NULL REFERENCES questions(id) ON DELETE CASCADE` | Failed question. |
| `session_id` | `UUID` | `NULLABLE REFERENCES quiz_sessions(id) ON DELETE SET NULL` | Session where failure occurred. |
| `selected_option`| `SMALLINT`| `NOT NULL` | Incorrect option chosen by student. |
| `incorrect_attempts` | `INTEGER` | `DEFAULT 1` | Cumulative times candidate missed this item. |
| `consecutive_correct`| `INTEGER` | `DEFAULT 0` | Successes in re-drills (reaches 2 to auto-resolve). |
| `resolved` | `BOOLEAN` | `DEFAULT false` | Whether candidate has mastered this mistake. |
| `first_failed_at`| `TIMESTAMPTZ`| `DEFAULT now()` | First error timestamp. |
| `last_failed_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Most recent error timestamp. |
| `resolved_at` | `TIMESTAMPTZ`| `NULLABLE` | Resolution timestamp. |
| `user_notes` | `TEXT` | `NULLABLE` | Candidate's personal memo or memory aid. |

---

### Table 6: `subject_stats`
Pre-aggregated candidate performance per subject for the analytics radar charts.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Record ID. |
| `user_id` | `UUID` | `NOT NULL REFERENCES profiles(id) ON DELETE CASCADE` | Candidate ID. |
| `subject` | `TEXT` | `NOT NULL` | `'Mathematics'`, `'Physics'`, `'Chemistry'`, `'Chinese'`. |
| `attempted` | `INTEGER` | `DEFAULT 0` | Questions attempted in this subject. |
| `correct` | `INTEGER` | `DEFAULT 0` | Correct answers in this subject. |
| `tests_taken` | `INTEGER` | `DEFAULT 0` | Full exams completed. |
| `highest_score` | `NUMERIC(5,2)` | `DEFAULT 0.00` | Best score out of 100. |
| `latest_score` | `NUMERIC(5,2)` | `DEFAULT 0.00` | Most recent score out of 100. |
| `updated_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Last calculation time. |

*Unique Index*: `(user_id, subject)`

---

### Table 7: `module_mastery`
Granular syllabus chapter breakdown per candidate for weakness identification.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Record ID. |
| `user_id` | `UUID` | `NOT NULL REFERENCES profiles(id) ON DELETE CASCADE` | Candidate ID. |
| `subject` | `TEXT` | `NOT NULL` | Subject name. |
| `module_title` | `TEXT` | `NOT NULL` | Module name (e.g., `'Mechanics'`). |
| `attempted` | `INTEGER` | `DEFAULT 0` | Total questions attempted for module. |
| `correct` | `INTEGER` | `DEFAULT 0` | Total questions answered correctly. |
| `updated_at` | `TIMESTAMPTZ`| `DEFAULT now()` | Last update timestamp. |

*Unique Index*: `(user_id, subject, module_title)`

---

## 3. Copy-Paste Supabase SQL Migration Script

Run the following SQL in your **Supabase Dashboard → SQL Editor** to create all tables, indexes, triggers, and Row Level Security (RLS) policies:

```sql
-- ============================================================================
-- CSCA EXAM PRACTICE PORTAL — SUPABASE SCHEMA MIGRATION
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_id TEXT UNIQUE NOT NULL,
  candidate_name TEXT NOT NULL,
  email TEXT NOT NULL,
  application_type TEXT DEFAULT 'CGS' CHECK (application_type IN ('CGS', 'Self-Funded', 'University-Direct')),
  target_university TEXT,
  registered_subjects TEXT[] DEFAULT ARRAY['Mathematics', 'Physics', 'Chemistry', 'Chinese']::TEXT[],
  streak_days INTEGER DEFAULT 1 CHECK (streak_days >= 0),
  last_active_date DATE DEFAULT CURRENT_DATE,
  total_questions_attempted INTEGER DEFAULT 0 CHECK (total_questions_attempted >= 0),
  total_correct INTEGER DEFAULT 0 CHECK (total_correct >= 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Exam Papers Catalog Table
CREATE TABLE public.exam_papers (
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
  track TEXT CHECK (track IN ('Science', 'Humanities')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Questions Table
CREATE TABLE public.questions (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  module TEXT NOT NULL,
  subtopic TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Standard' CHECK (difficulty IN ('Standard', 'Challenging', 'Advanced')),
  question_en TEXT NOT NULL,
  question_zh TEXT NOT NULL,
  options_en JSONB NOT NULL,
  options_zh JSONB NOT NULL,
  correct_option SMALLINT NOT NULL CHECK (correct_option BETWEEN 0 AND 3),
  explanation_en TEXT NOT NULL,
  explanation_zh TEXT NOT NULL,
  formula TEXT,
  syllabus_ref TEXT,
  exam_paper_id TEXT REFERENCES public.exam_papers(id) ON DELETE SET NULL,
  question_number INTEGER,
  section TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create Quiz Sessions Table
CREATE TABLE public.quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('past_paper', 'mock', 'daily', 'topic', 'ai', 'mistake')),
  subject TEXT NOT NULL,
  paper_id TEXT REFERENCES public.exam_papers(id) ON DELETE SET NULL,
  exam_paper_name TEXT,
  module_title TEXT,
  total_questions INTEGER NOT NULL,
  time_limit_seconds INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  user_answers JSONB DEFAULT '{}'::jsonb,
  flagged_questions JSONB DEFAULT '{}'::jsonb,
  is_completed BOOLEAN DEFAULT false,
  score NUMERIC(5,2) DEFAULT 0.00,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  unanswered_count INTEGER DEFAULT 0,
  accuracy NUMERIC(5,2) DEFAULT 0.00,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create Mistake Records Table
CREATE TABLE public.mistake_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE SET NULL,
  selected_option SMALLINT NOT NULL,
  incorrect_attempts INTEGER DEFAULT 1,
  consecutive_correct INTEGER DEFAULT 0,
  resolved BOOLEAN DEFAULT false,
  first_failed_at TIMESTAMPTZ DEFAULT now(),
  last_failed_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  user_notes TEXT,
  CONSTRAINT unique_user_question_mistake UNIQUE (user_id, question_id)
);

-- 7. Create Subject Stats Table
CREATE TABLE public.subject_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  attempted INTEGER DEFAULT 0,
  correct INTEGER DEFAULT 0,
  tests_taken INTEGER DEFAULT 0,
  highest_score NUMERIC(5,2) DEFAULT 0.00,
  latest_score NUMERIC(5,2) DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_subject_stat UNIQUE (user_id, subject)
);

-- 8. Create Module Mastery Table
CREATE TABLE public.module_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  module_title TEXT NOT NULL,
  attempted INTEGER DEFAULT 0,
  correct INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_module_mastery UNIQUE (user_id, subject, module_title)
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX idx_questions_paper_seq ON public.questions(exam_paper_id, question_number);
CREATE INDEX idx_questions_subject_module ON public.questions(subject, module);
CREATE INDEX idx_quiz_sessions_user_date ON public.quiz_sessions(user_id, started_at DESC);
CREATE INDEX idx_mistake_records_user_resolved ON public.mistake_records(user_id, resolved);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistake_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_mastery ENABLE ROW LEVEL SECURITY;

-- Catalog tables (Public Read-Only)
CREATE POLICY "Allow public read access to exam papers"
  ON public.exam_papers FOR SELECT USING (true);

CREATE POLICY "Allow public read access to questions"
  ON public.questions FOR SELECT USING (true);

-- Profiles (Candidate Self-Access)
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Quiz Sessions
CREATE POLICY "Users can view own quiz sessions"
  ON public.quiz_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz sessions"
  ON public.quiz_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz sessions"
  ON public.quiz_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Mistake Records
CREATE POLICY "Users can manage own mistake records"
  ON public.mistake_records FOR ALL USING (auth.uid() = user_id);

-- Analytics & Mastery
CREATE POLICY "Users can manage own subject stats"
  ON public.subject_stats FOR ALL USING (auth.uid() = user_id);

-- Users can manage own module mastery
CREATE POLICY "Users can manage own module mastery"
  ON public.module_mastery FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- AUTOMATED USER ONBOARDING TRIGGER
-- ============================================================================
-- Automatically provisions a candidate profile when a user registers via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    candidate_id,
    candidate_name,
    email,
    application_type,
    registered_subjects
  ) VALUES (
    NEW.id,
    'CSCA-' || to_char(now(), 'YYYY') || '-' || substr(md5(random()::text), 1, 4),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'CGS',
    ARRAY['Mathematics', 'Physics', 'Chemistry', 'Chinese']::TEXT[]
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```
