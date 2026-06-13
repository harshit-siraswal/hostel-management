# Hostel Management Website and Portal - Prompt Pack

Use these prompts one by one. Prompt 1 sets the direction, and the later prompts build the frontend and backend separately. Replace nothing unless a prompt tells you to update a specific repo path.

## Prompt 1 - Define the Architecture
```text
You are a senior product and solution architect. Design the final architecture for a hostel management platform with two separate repositories: a frontend repo at c:\Users\ASUS\Desktop\hostel-management and a backend repo at c:\Users\ASUS\Desktop\hostel management backend.

Use the following product scope: student registration, room allocation, fee and electricity billing, mess management, complaints, leave requests, visitor management, digital gate passes, reports, AI-based identity verification, occupancy analytics, complaint pattern analytics, and crowd alerts.

Your output must include:
1. A concise architecture summary.
2. A repo boundary chart showing what belongs in frontend and backend.
3. A role list and main user journeys.
4. A milestone plan for MVP, automation, and AI features.
5. A risk list with mitigations.

Do not write code yet. Focus on architecture, scope, and implementation order.
```

## Prompt 2 - Design the Backend Data Model
```text
You are working only in the backend repo at c:\Users\ASUS\Desktop\hostel management backend.

Design the complete backend data model for the hostel platform. Include tables or collections for users, roles, students, rooms, room allocations, bills, payments, mess entries, complaints, leave requests, visitors, gate passes, entry logs, AI verification logs, notifications, and reports.

Your output must include:
1. A schema or entity list with key fields.
2. Relationship notes and cardinality.
3. Indexing suggestions.
4. Validation rules for each major entity.
5. Any migrations or seed data that should exist before feature development.

Keep the answer backend-only. Do not create frontend files.
```

## Prompt 3 - Build Backend Auth and APIs
```text
You are working only in the backend repo at c:\Users\ASUS\Desktop\hostel management backend.

Implement authentication, role-based access control, and the core REST API surface for the hostel platform. Prioritize clean separation of modules for students, rooms, billing, mess, complaints, leave requests, visitors, gate passes, reports, and AI verification.

Your output must include:
1. Folder and module structure.
2. The authentication flow.
3. The key API routes and request or response shapes.
4. Validation and authorization rules.
5. Tests for the critical paths.

Do not touch the frontend repo in this prompt.
```

## Prompt 4 - Scaffold the Frontend App
```text
You are working only in the frontend repo at c:\Users\ASUS\Desktop\hostel-management.

Create the frontend application shell for the hostel management portal using React and Next.js. Build the routing, layout, navigation, shared components, auth pages, and role-aware dashboard entry points for students, guests, wardens, security, finance, and admins.

Your output must include:
1. Recommended frontend folder structure.
2. Route map and protected route strategy.
3. Shared UI component inventory.
4. State and data fetching approach.
5. The initial responsive shell for desktop and mobile.

Do not implement backend logic in this prompt.
```

## Prompt 5 - Build Role Dashboards and Workflows
```text
You are working only in the frontend repo at c:\Users\ASUS\Desktop\hostel-management.

Implement the role-specific user experiences for the hostel platform. Build student dashboards, warden dashboards, finance dashboards, security views, visitor flows, complaint forms, leave forms, billing screens, and room allocation views.

Your output must include:
1. A list of screens by role.
2. Reusable form and table components.
3. Loading, empty, and error states.
4. Charts or summary cards for operational metrics.
5. Accessibility and responsiveness notes.

Keep the implementation aligned with the backend API contract.
```

## Prompt 6 - Add AI and Analytics
```text
You are working across both repos, but keep implementation split by layer.

Extend the hostel platform with AI-based identity verification, occupancy analytics, complaint clustering, and crowd alert logic. Put provider integration, risk scoring, and audit logging in the backend repo. Put visualization, status indicators, and alert surfaces in the frontend repo.

Your output must include:
1. A provider-agnostic AI integration design.
2. A privacy and consent checklist.
3. Analytics metrics and alert thresholds.
4. Backend endpoints or jobs needed for AI processing.
5. Frontend UI elements needed to display verification and alert outcomes.

Do not blur repository boundaries.
```

## Prompt 7 - Add Reporting, Notifications, and Audit
```text
You are working only on the backend and the frontend view layer, but keep ownership clear.

Implement automated reports, notification triggers, and audit logs for the hostel platform. Reports should cover occupancy, bills, payments, complaints, leave requests, and visitor traffic.

Your output must include:
1. Report definitions and schedules.
2. Notification events and recipients.
3. Audit events that must always be recorded.
4. Export formats and download behavior.
5. UI surfaces in the frontend for reports and history views.

Make the reporting system usable by admins and finance staff.
```

## Prompt 8 - Finish with Tests and Deployment
```text
You are responsible for release hardening for the hostel management platform.

Create a final test and deployment plan for both repositories. Include unit tests, integration tests, end-to-end tests, sample seed data, environment variables, CI checks, and production deployment notes.

Your output must include:
1. A test matrix by feature and role.
2. CI or linting checks for both repos.
3. Deployment steps for dev, stage, and prod.
4. Backup, rollback, and migration notes.
5. A short release checklist for the team.

Do not add new product scope in this prompt. Focus on shipping quality.
```
