\# SWARA – API Documentation



\## 1. Introduction



This document describes the backend API endpoints used in the SWARA project.



Base URL: `http://localhost:5001`



\## 2. Health Check API



\*\*Endpoint:\*\* `/api/health`



\*\*Method:\*\* GET



\*\*Purpose:\*\* Checks whether the backend server and MongoDB database are working.



\*\*Successful Response:\*\*



```json

{

&#x20; "server": "ok",

&#x20; "database": "connected"

}

```



\## 3. Submit Report API



\*\*Endpoint:\*\* `/api/reports`



\*\*Method:\*\* POST



\*\*Purpose:\*\* Submits a new incident report.



\*\*Request Body:\*\*



```json

{

&#x20; "name": "Anonymous",

&#x20; "crimeType": "Harassment",

&#x20; "location": "Test Location",

&#x20; "description": "This is a dummy test description."

}

```



\*\*Successful Response:\*\* HTTP 201 Created.



The response contains a success message and limited report information.



\## 4. Retrieve Reports API



\*\*Endpoint:\*\* `/api/reports`



\*\*Method:\*\* GET



\*\*Purpose:\*\* Public report retrieval is restricted.



\*\*Response:\*\* HTTP 403 Forbidden.



```json

{

&#x20; "message": "Access to submitted reports is restricted."

}

```



\## 5. AI Backend



\*\*Base URL:\*\* `http://localhost:5002`



\*\*Health Endpoint:\*\* `/api/health`



The AI backend connects the frontend with the Google Gemini API for AI-assisted report suggestions.



\## 6. Rate Limiting



Report submission requests are rate-limited.



\- Time window: 15 minutes

\- Maximum requests: 5 per IP

\- Exceeding the limit returns HTTP 429 Too Many Requests.



\## 7. Error Handling



The backend handles:

\- Invalid JSON requests

\- Missing or invalid report fields

\- Database connection errors

\- Unknown API routes

\- Excessive report submission requests

