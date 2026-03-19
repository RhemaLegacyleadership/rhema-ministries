# Website Usage Guide

This guide explains how each role should use the platform.

## Roles in the System

- `Student`
- `Teacher`
- `Admin`

Each role has different permissions and dashboard actions.

## 1) Student Workflow

### Step 1: Create Account

1. Open `Register` page.
2. Fill name, email, phone, program, password.
3. Submit registration.
4. Your admission status starts as `pending`.

### Step 2: Wait for Application Review

- Admin must review and accept your admission application.
- Until accepted, you should not proceed as fully admitted student.

### Step 3: Pay School Fees

1. Go to `Student -> Payments`.
2. Pay using MTN Cameroon Mobile Money to:
   - `+237 679286428`
3. Enter:
   - your MoMo phone number
   - amount
   - transaction number
4. Submit payment for admin verification.

### Step 4: Payment Verification + Matricule

- Admin verifies your transaction number.
- After verification and acceptance, admin assigns your matricule.

### Step 5: Academic Activities

1. Go to `Student -> Assignments`.
2. Select teacher assignment and upload your submission file.
3. Track submission status (`submitted` / `graded`).

### Step 6: View Results and Download Report

1. Go to `Student -> Transcripts`.
2. View:
   - graded assignments
   - test/exam results entered by teachers
3. Click `Download Report` for combined academic result file.

## 2) Teacher Workflow

Teacher access is disabled by default and must be granted by admin.

### Step 1: Login (After Admin Approval)

1. Use teacher credentials to login.
2. If access not granted yet, login is blocked until admin enables teacher access.

### Step 2: Create Assignments

1. Go to `Teacher Dashboard`.
2. In `Create Assignment`:
   - choose course
   - add title, description, due date, max score
3. Publish assignment.

### Step 3: Receive and Grade Student Submissions

1. Open `Grade Submissions` section.
2. Review uploaded work.
3. Enter score to mark submission as graded.

### Step 4: Enter Test/Exam Grades

1. In `Record Test/Exam Grades`:
   - choose course
   - choose student
   - choose type (`test` or `exam`)
   - enter title and score
2. Save grade.

These grades become visible to both student and admin reports.

## 3) Admin Workflow

Admin controls admissions, payment verification, role access, matricules, and reporting.

### Step 1: Review Applications

1. Open `Admin Dashboard`.
2. In `Admission Applications`:
   - Accept or reject each pending student.

### Step 2: Verify MTN Payments

1. In `Fee Payment Verification`, review:
   - amount
   - payment target number
   - transaction number
2. Mark as `verified` or `rejected`.

### Step 3: Manage Teacher Access

1. In `Teacher Access Control`, grant or revoke access.
2. Teachers can only enter portal when granted.

### Step 4: Assign Matricules

1. In `Matricules & Result Reports`, assign matricule to students.
2. Typically done after:
   - accepted application
   - verified payment

### Step 5: Download Student Reports

1. In `Matricules & Result Reports`, click `Download Report`.
2. Report includes:
   - graded assignments
   - test/exam grades

## 4) Common Operational Rules

- Registration does not equal admission.
- Payment submission does not equal payment verification.
- Teacher account does not equal teacher access.
- Matricule assignment is an admin-only action.

## 5) Troubleshooting

### Student cannot proceed after registration

- Check application status in `admission_applications`.
- Admin must accept application.

### Teacher cannot log in to teacher portal

- Check `user_roles`:
  - `role` must be `teacher`
  - `teacher_access_granted` must be `true`

### Payment is not confirmed

- Verify transaction number in admin payment verification section.
- Confirm payment was sent to `+237 679286428`.

### No grades visible in student transcript

- Confirm teacher entered results in:
  - assignment grading
  - test/exam entry

## 6) Best Practice for Daily Use

- Admin reviews applications and payments daily.
- Teachers publish assignments with clear due dates and max scores.
- Students submit assignments from the portal only.
- Admin exports reports when needed for records and communication.
