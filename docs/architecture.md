\# SWARA – System Architecture



\## 1. Project Introduction



SWARA (Smart Women Assistance, Reporting \& Alert System) is a web-based safety assistance platform designed to help users prepare and submit incident reports.



It uses Artificial Intelligence to assist users in organizing their complaint descriptions.



\## 2. Technology Stack



\### Frontend

\- React.js

\- Vite

\- Tailwind CSS



\### Backend

\- Node.js

\- Express.js

\- MongoDB

\- Mongoose



\### AI Integration

\- Google Gemini API



\## 3. System Architecture



The project consists of three main components:



1\. Frontend – Provides the user interface.

2\. Main Backend – Handles report submissions and database operations.

3\. AI Backend – Connects with Gemini AI to generate report suggestions.



\## 4. Working Flow



1\. User opens the SWARA website.

2\. User navigates to the Report a Crime page.

3\. User enters a complaint description.

4\. AI Report Helper can analyze the description with user consent.

5\. Gemini generates a suggested category and summary.

6\. User reviews and applies the suggestions if appropriate.

7\. User submits the report.

8\. Main backend validates the submitted information.

9\. MongoDB stores the report.



\## 5. Security Features



\- Input validation

\- Rate limiting on report submissions

\- Public access to submitted reports restricted

\- Environment variables for API credentials

\- Error handling



\## 6. Important Limitation



SWARA is an educational project and is not an official police reporting or emergency response platform. AI suggestions are not official legal classifications.

