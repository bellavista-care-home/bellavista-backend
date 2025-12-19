# Step-by-Step AWS Production Deployment Guide

This guide will walk you through deploying the Bellavista application to AWS. Since you are new to AWS, we will use the most user-friendly services: **AWS App Runner** for the backend (Python) and **AWS Amplify** for the frontend (React).

---

## Phase 1: AWS Account & Security

1.  **Sign In:** Log in to your [AWS Console](https://console.aws.amazon.com/).
2.  **Create an IAM User (for programmatic access):**
    *   Go to **IAM** service > **Users** > **Create user**.
    *   Name: `bellavista-app-user`.
    *   Attach policies directly:
        *   `AmazonS3FullAccess` (for images)
        *   `AmazonSESFullAccess` (for emails)
    *   Create the user.
    *   **IMPORTANT:** Go to the "Security credentials" tab of the new user and **Create access key**.
    *   **SAVE** the `Access Key ID` and `Secret Access Key`. You will need these later.

---

## Phase 2: Database (PostgreSQL)

We will use **Amazon RDS** for the database.

1.  Go to **RDS** service > **Create database**.
2.  **Standard create**.
3.  **Engine options:** PostgreSQL.
4.  **Templates:** Free tier (if eligible) or Production.
5.  **Settings:**
    *   DB instance identifier: `bellavista-db`
    *   Master username: `postgres`
    *   Master password: Create a strong password (write it down!).
6.  **Instance configuration:** `db.t3.micro` (cheapest).
7.  **Connectivity:**
    *   Public access: **Yes** (Simplifies connection from App Runner/Local, lock down with Security Groups later).
    *   VPC Security Group: Create new (e.g., `bellavista-db-sg`).
8.  **Create database**.
9.  **Wait** for it to become "Available".
10. Click on the DB identifier to find the **Endpoint** (e.g., `bellavista-db.xxxx.eu-west-2.rds.amazonaws.com`).

**Connection String Format:**
`postgresql://postgres:YOUR_PASSWORD@YOUR_ENDPOINT:5432/postgres`

---

## Phase 3: File Storage (S3)

We will use **Amazon S3** to store uploaded images.

1.  Go to **S3** service > **Create bucket**.
2.  Bucket name: `bellavista-uploads-prod` (must be unique globally).
3.  Region: Choose the same region as your other services (e.g., London `eu-west-2`).
4.  **Object Ownership:** ACLs enabled -> Bucket owner preferred.
5.  **Block Public Access settings:** Uncheck "Block all public access" (We need images to be readable by the public).
    *   Acknowledge the warning.
6.  **Create bucket**.

---

## Phase 4: Email Service (SES)

We will use **Amazon SES** to send emails reliably.

1.  Go to **Amazon SES** service.
2.  **Identities** > **Create identity**.
3.  Select **Email address**.
4.  Enter the email you want to send *from* (e.g., `bellavistacarehomegit@gmail.com` or `admin@yourdomain.com`).
5.  **Create identity**.
6.  Go to your email inbox and click the verification link sent by AWS.
7.  **Sandbox Mode:** By default, you can only send TO verified emails. To send to anyone, you must request "Production Access" in the SES dashboard (takes ~24h). For now, verify any email you want to test sending TO as well.

---

## Phase 5: Deploy Backend (AWS App Runner)

App Runner connects to your GitHub repo, builds the Dockerfile, and runs it.

1.  **Push your code to GitHub** (if not already there).
2.  Go to **AWS App Runner** > **Create service**.
3.  **Source:** Source code repository.
4.  **Connect to GitHub** and select your repository.
5.  **Source directory:** `/backend`.
6.  **Deployment settings:** Automatic (deploys on push).
7.  **Build settings:**
    *   Runtime: Python 3
    *   Build command: `pip install -r requirements.txt`
    *   Start command: `gunicorn -b 0.0.0.0:8000 wsgi:app`
    *   Port: `8000`
    *   **BETTER OPTION:** Select "Configuration via `apprunner.yaml`" if you add that file, BUT simpler is just choosing **"Container Registry"** if you build Docker images, OR just use **Source Code** mode.
    *   *Correction for this project:* Since you have a `Dockerfile`, the best way is:
        1.  In App Runner Source, choose **Source code repository**.
        2.  Provider: GitHub.
        3.  Branch: main.
        4.  Source directory: `backend`.
        5.  **Configuration file:** `apprunner.yaml` (We need to create this, see below). OR select "Configure all settings here".
        6.  Runtime: **Python 3.11**.
        7.  Build command: `pip install -r requirements.txt`
        8.  Start command: `gunicorn -b 0.0.0.0:8000 wsgi:app`
        9.  Port: `8000`.

8.  **Service settings (Environment Variables):**
    *   `FLASK_CONFIG`: `production`
    *   `DATABASE_URL`: (The RDS connection string from Phase 2)
    *   `SECRET_KEY`: (A random long string)
    *   `AWS_ACCESS_KEY_ID`: (From Phase 1)
    *   `AWS_SECRET_ACCESS_KEY`: (From Phase 1)
    *   `AWS_REGION`: `eu-west-2` (or your region)
    *   `S3_BUCKET`: `bellavista-uploads-prod`
    *   `MAIL_SENDER`: (Verified SES email)
    *   `USE_SES`: `true`

9.  **Create & Deploy**.
10. Once running, copy the **Default domain** (e.g., `https://xyz.awsapprunner.com`). This is your `VITE_API_BASE_URL`.

---

## Phase 6: Deploy Frontend (AWS Amplify)

1.  Go to **AWS Amplify**.
2.  **Create new app** > **Gen 1** (or Gen 2) > **GitHub**.
3.  Select your repository and `main` branch.
4.  **Build settings:**
    *   Base directory: `bellavista` (IMPORTANT: Amplify needs to know the frontend is in a subfolder).
    *   Edit the `amplify.yml`:
        ```yaml
        version: 1
        applications:
          - appRoot: bellavista
            frontend:
              phases:
                preBuild:
                  commands:
                    - npm ci
                build:
                  commands:
                    - npm run build
              artifacts:
                baseDirectory: dist
                files:
                  - '**/*'
              cache:
                paths:
                  - node_modules/**/*
        ```
5.  **Environment Variables:**
    *   `VITE_API_BASE_URL`: The URL from Phase 5 (e.g., `https://xyz.awsapprunner.com/api`).
    *   (Remove any `VITE_EMAILJS_*` variables as we don't use them anymore).

6.  **Save and Deploy**.

---

## Summary of Optimization Changes

1.  **Email System:** We removed the slow, client-side `EmailJS`. Now, the backend sends emails using **AWS SES** asynchronously. This means the user gets an instant "Success" message while the email sends in the background.
2.  **Images:** Configured to upload directly to **S3** for unlimited storage and fast delivery, instead of storing on the server disk.
3.  **Database:** Switched to **PostgreSQL** (RDS) for production reliability.

## Troubleshooting

*   **Images not showing?** Check the S3 Bucket "Block Public Access" settings and ensuring the objects are uploaded with public-read ACLs (the code handles this).
*   **Emails not arriving?** Check AWS SES "Suppression List" or ensure you are out of "Sandbox Mode" if sending to unverified emails.
