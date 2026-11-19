\# SWARA – Test Cases and Results



\## 1. Introduction



This document describes the functional testing performed on the SWARA application.



\## 2. Test Environment



\- Frontend: React + Vite

\- Backend: Node.js + Express

\- Database: MongoDB

\- AI Service: Google Gemini API

\- Testing Tool: Web Browser and PowerShell



\## 3. Functional Test Cases



| Test ID | Test Scenario | Expected Result | Status |

|---|---|---|---|

| TC01 | Open SWARA homepage | Homepage loads successfully | Passed |

| TC02 | Open Report a Crime page | Report form appears | Passed |

| TC03 | Generate AI suggestions | AI suggestions are displayed | Passed |

| TC04 | Apply AI suggestions | Suggested information fills the form | Passed |

| TC05 | Submit a test report | Report is submitted successfully | Passed |

| TC06 | Check backend health | Server status is OK | Passed |

| TC07 | Check MongoDB connection | Database status is connected | Passed |

| TC08 | Access public reports endpoint | Request returns HTTP 403 | Passed |

| TC09 | Check npm security audit | No known vulnerabilities reported | Passed |



\## 4. Security Testing



\### Input Validation

The backend validates report fields before storing submitted information.



\### Rate Limiting

The report submission endpoint has a limit of 5 requests per IP within 15 minutes.



\### Public Data Access

Public GET access to submitted reports is restricted.



\### Dependency Audit

The backend npm audit reported zero vulnerabilities after dependency updates.



\## 5. Testing Limitations



\- Rate limiting has been configured but its complete limit behavior has not yet been tested.

\- Authentication and user-specific report access are not implemented.

\- The application has not undergone professional security testing.

\- AI-generated suggestions require human review.



\## 6. Conclusion



The main SWARA application features have been tested locally. The frontend, backend, database connection, AI assistance, and report submission functionality are working in the current development environment.

