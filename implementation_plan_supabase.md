
# Implementation Plan - Supabase Integration for TuTesisRD

This plan outlines the steps to integrate Supabase as the backend for the TuTesisRD application. We will create a new project, set up the database schema to match the registration form, and connect the frontend.

## User Review Required

> [!IMPORTANT]
> **Project Creation Cost**: Creating a new Supabase project may have cost implications depending on your organization's plan.
> **Confirm Organization**: I plan to create the project "TuTesisRD" in the organization **"miturnord"** (ID: `naeutbwplhpbsecpogbf`). Please confirm if this is correct.

## Proposed Database Schema

We will create the following tables to store registration data:

### 1. `students`
Stores personal and academic information.
- `id`: UUID (Primary Key)
- `name`: Text
- `lastname`: Text
- `email`: Text (Unique)
- `phone`: Text
- `university`: Text
- `career`: Text
- `created_at`: Timestamp

### 2. `projects`
Stores project details and status.
- `id`: UUID (Primary Key)
- `student_id`: UUID (Foreign Key -> students.id)
- `type`: Text (Tesis, Monográfico, Curso Final, Tarea, Artículo, Presentación)
- `description`: Text
- `amount`: Numeric/Text (Budget/Price)
- `status`: Text (Default: 'pending') - e.g., 'pending', 'assigned', 'in_progress', 'completed'
- `tracking_code`: Text (Unique, for monitoring)
- `created_at`: Timestamp

### 3. `documents` (Optional for MVP, can be part of projects initially or separate)
- `id`: UUID
- `project_id`: UUID
- `file_url`: Text
- `file_type`: Text

## Implementation Steps

1.  **Create Supabase Project**
    - Create a new project named "TuTesisRD".
    - Wait for initialization.

2.  **Apply Database Schema**
    - Execute SQL to create `students` and `projects` tables.
    - Set up Row Level Security (RLS) policies (initially public insert for registration, read-only for monitoring by code).

3.  **Frontend Integration**
    - Install supabase-js: `npm install @supabase/supabase-js`
    - Create `src/supabaseClient.ts` with environment variables.
    - Update `RegisterWizard.tsx`:
        - On final submit, insert into `students`.
        - Then insert into `projects` using the returned student ID.
        - Upload files to Supabase Storage (if enabled) or just store metadata if files are sent via WhatsApp.
    - Update `SuccessScreen.tsx`:
        - Display the actual generated `tracking_code`.
    - Update Monitoring View:
        - Query `projects` by `tracking_code`.

## Verify

- Test registration flow: Data appears in Supabase tables.
- Test monitoring flow: Entering code returns correct status.
