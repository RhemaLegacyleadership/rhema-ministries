# Website Setup and Integration Guide (Detailed)

This guide is written for a non-technical or semi-technical admin and explains how to bring the website from code to a working school portal in production.

Use it as a checklist. Do each section in order.

## 1) What must be connected

To function correctly, this website needs these systems:

1. **Frontend app (React/Vite)** - the website users open in browser.
2. **Supabase project** - authentication, database, and file storage.
3. **MTN Mobile Money process** - operational payment workflow (manual verification by admin).
4. **Hosting provider** (optional for public launch) - where production website runs.

Without Supabase configuration and database migrations, the portal will not work.

## 2) Requirements before starting

Install and prepare:

- `Node.js` LTS (includes npm): [https://nodejs.org](https://nodejs.org)
- Optional: `Git`: [https://git-scm.com](https://git-scm.com)
- Supabase account: [https://supabase.com](https://supabase.com)
- Code editor (Cursor or VS Code)

Confirm your tools:

```bash
node -v
npm -v
```

If commands fail, reinstall Node.js.

## 3) Open project and install dependencies

1. Open terminal in the folder containing the project.
2. Enter project root (the folder that has `package.json`).
3. Install dependencies:

```bash
npm install
```

Expected result: a `node_modules` folder is created, and install completes without fatal errors.

## 4) Create and verify `.env`

This project reads Supabase credentials from `.env`.

Your `.env` file (project root) must contain:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_KEY
```

Where to find values:

1. Supabase Dashboard -> your project.
2. Go to `Project Settings` -> `API`.
3. Copy:
   - **Project URL** -> `VITE_SUPABASE_URL`
   - **anon public key** -> `VITE_SUPABASE_PUBLISHABLE_KEY`

Important:

- Do not put quotes around values.
- Do not use the service role key in frontend `.env`.

## 5) Configure Supabase (database/auth/storage)

This is the most important step.

### 5.1 Run SQL migrations in order

Open Supabase -> `SQL Editor`, then run these files one by one:

1. `supabase/migrations/20260311153517_82edc652-be1a-4b7f-8763-51644df0d210.sql`
2. `supabase/migrations/20260311183500_portal_workflows.sql`

Why order matters:

- The second migration extends and depends on objects created by the first.

After running, verify no SQL errors were returned.

### 5.2 Verify tables exist

In Supabase -> `Table Editor`, confirm these tables exist:

- `profiles`
- `assignments`
- `user_roles`
- `admission_applications`
- `fee_payments`
- `courses`
- `course_enrollments`
- `teacher_assignments`
- `assignment_submissions`
- `exam_results`

If any are missing, rerun migrations and check for SQL errors.

### 5.3 Verify storage buckets

In Supabase -> `Storage`, verify buckets:

- `avatars`
- `assignments`

Usage:

- `avatars`: profile pictures
- `assignments`: assignment and submission files

### 5.4 Verify authentication settings

In Supabase -> `Authentication` -> `Providers`:

- Ensure **Email provider** is enabled.

Recommended:

- Enable email confirmation only if you are ready to manage mail delivery.
- For testing, you may disable email confirmation temporarily.

## 6) Bootstrap the first admin account

By default, every new account is `student`. You must manually promote one account to `admin`.

### 6.1 Create an account normally

Use website registration once (or create a user in Supabase Auth).

### 6.2 Get user UUID

In Supabase -> `Authentication` -> `Users`, copy the user id.

### 6.3 Promote user to admin

Run in SQL Editor:

```sql
update public.user_roles
set role = 'admin'
where user_id = 'PUT_ADMIN_USER_UUID_HERE';
```

Expected result: 1 row updated.

## 7) Optional bootstrap: teacher accounts and courses

To use teacher portal immediately, seed minimal data.

### 7.1 Set teacher role and access

```sql
update public.user_roles
set role = 'teacher',
    teacher_access_granted = true
where user_id = 'TEACHER_USER_UUID_HERE';
```

### 7.2 Create a course and assign teacher

```sql
insert into public.courses (code, title, teacher_id)
values ('THE101', 'Introduction to Theology', 'TEACHER_USER_UUID_HERE');
```

### 7.3 Enroll a student in the course

```sql
insert into public.course_enrollments (course_id, student_id)
values ('COURSE_UUID_HERE', 'STUDENT_USER_UUID_HERE');
```

## 8) MTN Mobile Money integration (current model)

Current implementation is **manual verification workflow**, not direct MTN API integration.

How it works:

1. Student pays via MTN Mobile Money to `+237 679286428`.
2. Student enters transaction number in portal.
3. Admin verifies transaction externally (phone/payment records).
4. Admin marks payment `verified` or `rejected`.

Operational controls recommended:

- Create a daily payment verification log (date, admin name, txn id).
- Do not verify without confirming amount and sender.
- Keep screenshot/evidence archive for disputed transactions.

## 9) Run locally (development)

Start app:

```bash
npm run dev
```

Open shown URL (usually `http://localhost:8080`).

If you get blank screen:

- Check `.env` values.
- Check browser dev tools network errors.
- Check Supabase keys and migrations.

## 10) Complete end-to-end test script

Perform this in order to confirm full operation:

1. Register new student.
2. Confirm student row appears in `profiles`.
3. Confirm role row appears in `user_roles` as `student`.
4. Confirm application row in `admission_applications` as `pending`.
5. Student submits fee payment transaction number.
6. Confirm row in `fee_payments` as `pending`.
7. Admin logs in and verifies payment.
8. Admin accepts admission application.
9. Admin assigns matricule in dashboard.
10. Teacher creates assignment.
11. Student sees assignment and submits file.
12. Teacher grades submission.
13. Teacher records test/exam result.
14. Student opens transcripts and downloads report.
15. Admin downloads same student report.

If any step fails, inspect corresponding table and row-level policy behavior.

## 11) Known operational gaps (important)

These are not fully implemented as production-hard features yet:

- Some menu links point to pages not yet created.
- No direct MTN API callback/webhook integration (manual verification only).
- Route-level role guards are basic and should be hardened.
- PDF output is HTML-download based report, not server-generated official PDF.

## 12) Deploy to production

Use any static frontend host (Vercel, Netlify, Cloudflare Pages, etc.).

Minimum production setup:

1. Deploy frontend.
2. Add same environment variables on host:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Ensure production Supabase has same migrations and data policies.
4. Test with real user accounts before public launch.

Security rules:

- Never expose Supabase service role key in frontend.
- Rotate keys if leaked.
- Restrict admin access to trusted accounts only.

## 13) Troubleshooting quick map

- **Cannot login:** check Supabase Auth provider + user existence.
- **Teacher blocked from dashboard:** check `user_roles.role='teacher'` and `teacher_access_granted=true`.
- **Student cannot submit assignments:** check course enrollment + storage policies + bucket.
- **Payment update fails:** check admin role and RLS policies on `fee_payments`.
- **No transcript grades visible:** check `assignment_submissions.status='graded'` and `exam_results` entries.

## 14) Handover checklist for your team

Before handover, ensure:

- [ ] Admin account created and tested
- [ ] At least 1 teacher account approved
- [ ] Courses created and linked to teachers
- [ ] Students enrolled in courses
- [ ] MTN verification process documented internally
- [ ] End-to-end test script completed successfully
- [ ] Deployment URL tested on phone and desktop
