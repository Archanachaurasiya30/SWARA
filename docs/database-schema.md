\# SWARA – Database Schema



\## 1. Database Information



\- Database: MongoDB

\- ODM: Mongoose

\- Collection: reports

\- Model: Report



\## 2. Report Collection



The Report collection stores incident reports submitted through the SWARA platform.



\## 3. Fields Description



| Field | Data Type | Required | Description |

|---|---|---|---|

| name | String | No | Name of the person submitting the report |

| crimeType | String | Yes | Category of the reported incident |

| location | String | Yes | Location associated with the incident |

| description | String | Yes | Detailed description of the incident |

| date | Date | No | Date of the report, defaults to current date |

| createdAt | Date | Automatic | Document creation timestamp |

| updatedAt | Date | Automatic | Last update timestamp |



\## 4. Crime Categories



The system supports five categories:



1\. Harassment

2\. Stalking

3\. Domestic Violence

4\. Cyber Crime

5\. Other



\## 5. Validation Rules



\- Crime type is mandatory.

\- Crime type must match one of the predefined categories.

\- Location is mandatory.

\- Description is mandatory.

\- Description must contain at least 10 characters.

\- Name is optional and defaults to Anonymous.

\- String fields use trimming to remove surrounding whitespace.



\## 6. Automatic Timestamps



Mongoose timestamps are enabled.



The following fields are automatically maintained:



\- createdAt

\- updatedAt



\## 7. Data Storage Workflow



1\. User submits a report through the frontend.

2\. Express backend receives the request.

3\. Backend validates the submitted information.

4\. Mongoose creates a Report document.

5\. MongoDB stores the report in the reports collection.



\## 8. Privacy Note



Submitted reports may contain sensitive information. Public access to the report retrieval endpoint is restricted in the current project implementation.

