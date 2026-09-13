# 🎓 College Attendance Portal

## AI Agent Development Specification

This README is the primary specification for the Antigravity AI coding agent. Read it completely before making changes to the project.

---

## 1. Project Overview

Build a modern, secure, responsive **College Attendance Management Portal** for managing student attendance.

The system has three roles:

- Student
- Faculty
- Administrator

The portal should allow faculty to record attendance, students to monitor attendance, and administrators to manage the overall system.

The final product should look and feel like a professional production-ready college SaaS application, not a basic CRUD project.

---

## 2. Main Goals

The application should:

- Make attendance management simple.
- Reduce manual attendance work.
- Allow students to monitor attendance.
- Give faculty a fast attendance-marking interface.
- Give administrators complete management controls.
- Provide useful attendance analytics.
- Highlight students with low attendance.
- Provide attendance reports.
- Work on desktop, tablet, and mobile.
- Have a clean, modern, professional UI.

---

## 3. User Roles

### 3.1 Student

Students can:

- Login securely.
- View their dashboard.
- View overall attendance percentage.
- View subject-wise attendance.
- View attendance history.
- View an attendance calendar.
- View timetable.
- View announcements.
- View attendance warnings.
- View attendance trends.
- Calculate classes required to reach a target percentage.
- View and update appropriate profile settings.

Students must NOT be able to modify their own attendance.

### 3.2 Faculty

Faculty can:

- Login securely.
- View faculty dashboard.
- View assigned subjects.
- View assigned classes/sections.
- Select subject, date, and period.
- View student lists.
- Mark students Present/Absent.
- Use "Mark All Present".
- Edit attendance where permitted.
- Search and filter students.
- View attendance statistics.
- View low-attendance students.
- Generate attendance reports.
- Export reports.
- Post announcements where permitted.

Faculty must only manage attendance for their assigned subjects/classes.

### 3.3 Administrator

Administrators can:

- View the college dashboard.
- Manage students.
- Manage faculty.
- Manage departments.
- Manage courses.
- Manage semesters.
- Manage sections.
- Manage subjects.
- Assign faculty to subjects.
- Assign students to sections.
- Manage academic years.
- View college-wide attendance.
- View analytics.
- Generate reports.
- Manage announcements.
- Configure attendance settings.
- Manage user accounts.

---

## 4. Recommended Technology Stack

Use this stack unless there is a strong technical reason to change it.

### Frontend

- React
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Lucide React
- Recharts

### Backend

- Node.js
- Express
- TypeScript

### Database

Preferred:

- PostgreSQL

Alternative:

- Supabase

### Authentication

Use secure authentication with:

- Email/username + password
- Role-based authorization
- Secure sessions or JWT
- Password hashing
- Protected routes

Never store plain-text passwords.

---

## 5. Project Architecture

Use a clean modular architecture.

Suggested structure:

```text
attendance-portal/
├── README.md
├── package.json
├── .gitignore
├── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── assets/
│   │   └── App.tsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── models/
│   │   ├── utils/
│   │   └── server.ts
│   └── package.json
│
├── database/
│   ├── migrations/
│   └── seed/
│
└── docs/
```

Keep components reusable. Avoid unnecessarily large files.

If the existing Antigravity project uses a different valid structure, inspect it first and adapt rather than unnecessarily rewriting it.

---

## 6. Core Pages

### Login

Create a professional login screen containing:

- College logo
- Portal name
- Username/email field
- Password field
- Show/hide password
- Remember me
- Login button
- Forgot password
- Validation messages
- Loading state
- Error state

Never expose passwords or sensitive information.

---

# 7. Student Dashboard

Create a modern dashboard containing:

### Header

- Welcome message
- Student name
- Notifications
- Profile menu

### Attendance Summary

Show:

- Overall attendance
- Present classes
- Absent classes
- Total classes

Example:

```text
Overall Attendance
82.4%

Present: 103
Absent: 22
Total: 125
```

### Subject Cards

Example:

```text
C Programming      84%
Mathematics        91%
Data Structures    79%
Statistics         76%
```

Use clear progress indicators.

---

# 8. Attendance Status System

Use configurable attendance status levels.

Example defaults:

```text
90% - 100%     Excellent
80% - 89%      Good
75% - 79%      Warning
Below 75%      Critical
```

These values must be configurable by the administrator.

Do not hard-code college-specific attendance rules throughout the application.

---

# 9. Attendance Calculator

Add an attendance calculator.

The student should be able to enter or use current:

- Present classes
- Total classes
- Target attendance percentage

Use:

```text
Attendance % = (Present Classes / Total Classes) × 100
```

For future classes, calculate the minimum number of consecutive classes required to reach the target:

```text
(P + x) / (T + x) >= R
```

Where:

- P = present classes
- T = total classes
- R = target percentage
- x = future classes attended

Handle cases where the target is already reached.

If the target cannot be reached within a defined practical limit, explain the result clearly.

---

# 10. Attendance History

Create an attendance history page showing:

- Date
- Subject
- Period
- Faculty
- Status

Example:

```text
Date          Subject          Period     Status
10 Sep 2026   C Programming    1          Present
10 Sep 2026   Mathematics      2          Present
10 Sep 2026   Statistics       3          Absent
```

Add:

- Search
- Date filter
- Subject filter
- Status filter

---

# 11. Attendance Calendar

Create a calendar interface with visual indicators for:

- Present
- Absent
- Holiday
- No class

Clicking a date should display attendance details for that date.

Do not rely only on color to communicate status.

---

# 12. Attendance Analytics

Provide charts for:

- Weekly attendance
- Monthly attendance
- Subject comparison
- Present vs absent
- Attendance trends

Use Recharts.

Charts must be:

- Responsive
- Clearly labeled
- Equipped with useful tooltips
- Understandable without excessive decoration

---

# 13. Timetable

Create a timetable page.

Example:

```text
Time       Monday         Tuesday         Wednesday
9:30       Mathematics    C Programming   Statistics
10:30      Data Struct.   Mathematics     C Programming
11:30      Break          Break           Break
12:00      Statistics     Data Struct.    Mathematics
```

Make it responsive on mobile.

---

# 14. Announcements

Students should be able to see announcements.

Each announcement contains:

- Title
- Description
- Date
- Author
- Priority

Priority options:

- Normal
- Important
- Urgent

Authorized faculty/admin users can create announcements.

---

# 15. Faculty Dashboard

Create a faculty-specific dashboard showing:

- Total assigned students
- Subjects handled
- Classes today
- Attendance completion
- Low-attendance students

Example:

```text
Today's Classes

C Programming
BSc CS - Section A
10:30 AM
Attendance Pending
```

Provide a prominent:

```text
MARK ATTENDANCE
```

action.

---

# 16. Attendance Marking Interface

This is one of the most important screens.

It must be fast and easy to use.

Example:

```text
C Programming
BSc CS - Section A
10 September 2026
Period 2

[ Mark All Present ]

Roll No   Student Name       Status
01        Student 1          Present
02        Student 2          Present
03        Student 3          Absent
04        Student 4          Present

Present: 42
Absent: 3

[ Submit Attendance ]
```

Each student should have a simple Present/Absent control.

Before final submission, show a confirmation.

Optional statuses such as Late or Excused should only be implemented if enabled by the administrator.

---

# 17. Attendance Editing

Attendance editing must be permission-controlled.

When attendance is changed, record:

- User who changed it
- Original status
- New status
- Timestamp
- Reason

Maintain an audit trail.

---

# 18. Admin Dashboard

Create a college-level dashboard showing:

```text
Total Students
Total Faculty
Total Departments
Average Attendance
Students Below Threshold
```

Add charts for:

- Department attendance
- Course attendance
- Monthly attendance
- Low-attendance distribution

---

# 19. Student Management

Administrators can:

- Add student
- Edit student
- Disable student account
- Assign course
- Assign semester
- Assign section
- Search students
- Filter students

Suggested fields:

```text
Student ID
Name
Email
Phone (optional)
Course
Department
Semester
Section
Academic Year
Status
```

Avoid collecting unnecessary personal information.

---

# 20. Faculty Management

Administrators can:

- Add faculty
- Edit faculty
- Disable faculty
- Assign subjects
- Assign sections

Suggested fields:

```text
Faculty ID
Name
Email
Department
Status
```

---

# 21. Subject Management

Administrators can create/manage:

```text
Subject Code
Subject Name
Department
Semester
Credits
Assigned Faculty
```

---

# 22. Department / Course Management

Administrators can manage:

- Departments
- Courses
- Semesters
- Sections
- Academic years

Do not hard-code academic structures.

---

# 23. Reports

Create a Reports section.

### Student Attendance Report

```text
Student
Roll Number
Subject
Present
Absent
Percentage
```

### Subject Report

```text
Subject
Total Classes
Average Attendance
Low Attendance Students
```

### Class Report

```text
Class
Total Students
Average Attendance
Students Below Threshold
```

Allow authorized users to export:

- CSV
- PDF

---

# 24. Search and Filtering

Create reusable search/filter components.

Support:

- Student search
- Faculty search
- Department filter
- Semester filter
- Section filter
- Subject filter
- Date filter
- Attendance status filter

Avoid unnecessary full-page reloads.

---

# 25. Notifications

Create a notification system.

Examples:

```text
Attendance Warning
Your Statistics attendance has fallen below 75%.
```

```text
New Announcement
Tomorrow's class schedule has been updated.
```

Notifications should have read/unread states.

---

# 26. UI / UX Design

The UI should look like a modern professional SaaS dashboard.

### Design principles

- Clean layout
- Consistent spacing
- Good whitespace
- Rounded cards
- Subtle shadows
- Strong typography
- Clear visual hierarchy
- Professional academic appearance
- Responsive components

Avoid:

- Excessive gradients
- Excessively bright colors
- Clutter
- Excessive animation
- Decorative elements that reduce usability

Use a consistent design system across all roles.

---

# 27. Responsive Design

The application must work on:

- Desktop
- Laptop
- Tablet
- Mobile

Desktop:

```text
Sidebar + Main Content
```

Mobile:

```text
Top Bar
Scrollable Content
Mobile Navigation
```

Large tables should become horizontally scrollable or transform into mobile-friendly cards.

---

# 28. Accessibility

Follow accessibility best practices:

- Semantic HTML
- Keyboard navigation
- Accessible labels
- Good contrast
- Visible focus states
- ARIA labels where appropriate
- Do not communicate important information using color alone

---

# 29. Loading States

Every API-dependent page must have an appropriate loading state.

Prefer:

- Skeleton loaders
- Spinners where appropriate

Avoid blank screens while data loads.

---

# 30. Error Handling

Use friendly error messages.

Example:

```text
Something went wrong.

We couldn't load your attendance.

[ Try Again ]
```

Never expose stack traces, database errors, secrets, or internal implementation details to users.

---

# 31. Empty States

Create useful empty states.

Example:

```text
No attendance records found.

Attendance records will appear here after classes are conducted.
```

---

# 32. Security Requirements

Security is critical.

Implement:

- Password hashing
- Authentication
- Role-based authorization
- Protected API routes
- Input validation
- Server-side authorization
- Secure environment variables
- Appropriate rate limiting
- Safe error messages
- Database constraints

Never trust role information supplied by the client.

A student must never be able to access another student's attendance by changing an ID in the URL.

---

# 33. Database Design

Suggested entities:

```text
users
students
faculty
departments
courses
semesters
sections
subjects
faculty_subjects
student_sections
timetable
attendance
attendance_audit_logs
announcements
notifications
academic_years
```

Attendance should reference:

```text
student
subject
faculty
section
date
period
status
```

Prevent duplicate attendance records for the same student/class/date/period.

Use appropriate indexes and foreign keys.

---

# 34. API Design

Use RESTful APIs.

Examples:

```text
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/students/me
GET    /api/students/me/attendance

GET    /api/subjects
GET    /api/subjects/:id/attendance

POST   /api/attendance
PUT    /api/attendance/:id

GET    /api/reports/attendance

GET    /api/announcements
POST   /api/announcements
```

Use appropriate HTTP status codes.

Keep business logic out of route definitions where possible.

---

# 35. Environment Variables

Never commit secrets.

Create:

```text
.env.example
```

Example:

```env
DATABASE_URL=
JWT_SECRET=
API_URL=
```

The real `.env` file must not be committed.

Add `.env` to `.gitignore`.

---

# 36. Demo Data

During development, create realistic seed/demo data for:

- Admin
- Faculty
- Students
- Subjects
- Sections
- Attendance records
- Announcements
- Timetable

Do not use real student information.

Clearly separate demo data from production data.

---

# 37. Authentication Demo

For local development, provide a simple demo login mechanism if required.

Demo roles:

```text
Admin
Faculty
Student
```

Never use real credentials or real personal data.

---

# 38. Performance

The application should be fast.

Requirements:

- Avoid unnecessary API calls.
- Use pagination for large tables.
- Debounce search inputs where appropriate.
- Lazy-load large pages/components where useful.
- Optimize database queries.
- Avoid unnecessary React re-renders.

---

# 39. Code Quality

The AI agent must:

- Prefer TypeScript.
- Use meaningful names.
- Avoid duplicated code.
- Create reusable components.
- Keep functions manageable.
- Add comments only where useful.
- Avoid unnecessary dependencies.
- Maintain a consistent folder structure.

Do not create a giant single-file application.

---

# 40. Development Workflow

Develop incrementally.

Do NOT attempt to build the entire system in one step.

## Phase 1 — Project Setup

- Inspect existing project.
- Initialize/configure the frontend.
- Configure TypeScript.
- Configure Tailwind.
- Configure routing.
- Configure linting/formatting.

## Phase 2 — UI

Build:

- Login
- Student dashboard
- Faculty dashboard
- Admin dashboard
- Navigation
- Responsive layouts

Use mock data initially.

## Phase 3 — Student Features

Implement:

- Attendance summary
- Subject attendance
- Attendance history
- Calendar
- Timetable
- Announcements
- Attendance calculator

## Phase 4 — Faculty Features

Implement:

- Faculty dashboard
- Subject selection
- Class selection
- Attendance marking
- Attendance editing
- Reports

## Phase 5 — Admin Features

Implement:

- Student management
- Faculty management
- Subject management
- Department management
- Section management
- Academic year management

## Phase 6 — Backend

Implement:

- API
- Database
- Authentication
- Authorization
- Validation

## Phase 7 — Integration

Connect frontend to backend.

Remove unnecessary mock data.

## Phase 8 — Testing

Test:

- Authentication
- Role permissions
- Attendance marking
- Attendance calculations
- Duplicate prevention
- Reports
- Responsive UI
- Error states

## Phase 9 — Polish

Improve:

- UI consistency
- Accessibility
- Performance
- Loading states
- Error handling
- Empty states
- Useful animations

---

# 41. AI Agent Rules

The AI coding agent must follow these rules.

### Rule 1
Read this README completely before making changes.

### Rule 2
Inspect the existing project before modifying it.

### Rule 3
Do not unnecessarily rewrite working code.

### Rule 4
Before creating a component, check whether an existing reusable component can be reused.

### Rule 5
Never expose secrets or credentials.

### Rule 6
Do not present mocked functionality as production functionality. Clearly identify demo/mock behavior.

### Rule 7
When a technical decision is unclear, choose the simplest maintainable solution.

### Rule 8
Keep frontend and backend responsibilities separate.

### Rule 9
Important validation and authorization must happen on the backend.

### Rule 10
After implementing a feature, test it before moving to the next feature.

### Rule 11
Do not install unnecessary libraries.

### Rule 12
Do not modify unrelated project files.

### Rule 13
Preserve existing working functionality.

### Rule 14
If an error occurs, diagnose the root cause instead of applying random fixes.

---

# 42. Attendance Calculation Logic

Attendance percentage:

```text
Attendance % = (Present Classes / Total Classes) × 100
```

For reaching a target:

```text
(P + x) / (T + x) >= R
```

Where:

```text
P = Present classes
T = Total classes
R = Target percentage
x = Future consecutive attended classes
```

The implementation must:

- Handle zero total classes.
- Handle already-achieved targets.
- Return an accurate result.
- Avoid floating-point display issues.
- Clearly explain the result.

---

# 43. Important Edge Cases

Handle:

- Student with no attendance records.
- New student.
- New subject.
- No classes conducted.
- Student already above target.
- Attendance target below current percentage.
- Duplicate attendance submission.
- Faculty without assigned subjects.
- Disabled users.
- Network failure.
- Expired session.
- Unauthorized API request.
- Missing timetable data.
- Deleted/archived academic records.

---

# 44. Audit Logging

Important administrative actions should be logged.

Examples:

```text
Attendance modified
Student created
Faculty created
Subject assigned
User disabled
Attendance settings changed
```

Log:

```text
User
Action
Timestamp
Relevant record
```

Never log passwords, tokens, or sensitive authentication information.

---

# 45. Future Features

Keep the architecture flexible for:

- QR-based attendance
- College ID integration
- Email notifications
- Parent notifications
- Mobile application
- Biometric integration
- AI attendance insights
- Attendance prediction
- Leave management
- Faculty workload management
- Examination eligibility checker

Do NOT implement these unless explicitly requested.

---

# 46. Definition of Done

A feature is complete only when:

- UI is implemented.
- Responsive behavior works.
- Loading state exists.
- Error state exists where relevant.
- Validation exists.
- Authorization is respected.
- API/database integration works where applicable.
- No obvious console errors exist.
- Existing functionality still works.
- Code is clean and reusable.

---

# 47. First Development Task

Start with **Phase 1 and Phase 2 only**.

The AI agent must:

1. Inspect the existing project.
2. Initialize/configure the frontend structure if necessary.
3. Create the application layout.
4. Create the login page.
5. Create the Student Dashboard.
6. Create the Faculty Dashboard.
7. Create the Admin Dashboard.
8. Create responsive sidebar/navigation.
9. Use realistic mock data initially.
10. Make the UI polished and professional.
11. Run/build the application.
12. Fix visible errors before finishing.

Do NOT implement the database or production authentication backend yet.

Wait for further instructions before starting Phase 3.

---

# 48. Final Product Goal

The final application should feel:

```text
Simple
Fast
Professional
Responsive
Secure
Maintainable
Easy to understand
```

Build the project as if it may eventually be used by a real college.

Prioritize:

```text
Correctness
    ↓
Security
    ↓
Usability
    ↓
Maintainability
    ↓
Performance
    ↓
Visual polish
```

Do not sacrifice functionality or security merely to make the interface look impressive.

---

# 49. Antigravity Agent Starting Instruction

After reading this README, do the following:

1. Inspect the entire current project structure.
2. Identify the existing framework and dependencies.
3. Do not delete or rewrite working code without a reason.
4. Create a development plan based on Phase 1 and Phase 2.
5. Implement only Phase 1 and Phase 2.
6. Use mock data for now.
7. Test the application.
8. Fix errors.
9. Keep the code modular and reusable.
10. Stop after Phase 2 and provide a concise summary of what was implemented.

**Important:** Do not implement later phases until explicitly instructed.
