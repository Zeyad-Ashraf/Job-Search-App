Job Search App
A job search platform similar to LinkedIn, allowing companies to post jobs and users to apply easily.

Features
Company Management

  Companies added by users remain pending until admin approval.
  Company owners can add, update, and delete their companies (CRUD operations).
  Company owners can assign HR roles to manage job postings.
User & Authentication

  Users can register and sign in securely.
  Authentication is managed using JWT.
  
Job Search & Application

  Users can search for jobs within specific companies.
  Easy job application process.
  Advanced job filtering by:
  Location
  Job Title
  Working Time (Full-time, Part-time)

Additional Features

  Email Notifications using Nodemailer.
  File Uploads (Resumes, Company Logos, etc.) using Multer.
  Cloud Storage for images and documents using Cloudinary.
  Automated Tasks using Cron Jobs (e.g., deleting expired otp each 6 hours).
  
Security Enhancements

  Rate Limiting to prevent abuse and DDoS attacks.
  CORS (Cross-Origin Resource Sharing) to manage API access.
  Helmet for securing HTTP headers.
  
Tech Stack

  Backend:
    Express.js
    Mongoose (MongoDB)
    GraphQL
    JWT for authentication
    REST API
    Nodemailer (Email notifications)
    Multer (File uploads)
    Cloudinary (Cloud storage)
    Rate Limit (Prevents excessive API requests)
    CORS (Cross-Origin Resource Sharing)
    Helmet (Secures HTTP headers)
    Cron Jobs (Automated scheduled tasks)
    
