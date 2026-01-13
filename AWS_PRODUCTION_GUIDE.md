# Step-by-Step AWS Production Deployment Guide

This guide will walk you through deploying the Bellavista application to AWS. Since you are new to AWS, we will uComplete your account setup
Thanks for signing up for Amazon Web Services. If we have directed you to this page, then you have either not finished registering, or your account is currently on free plan.

Account setup checklist
Provided all required information during sign-up. This includes adding a payment method, completing identity verification, and selecting a support plan.
Responded to any additional information we have requested by email. Check your spam and junk email folders to make sure you have not missed any such requests.
Verified your credit card information. We might temporarily hold up to $1 USD (or an equivalent amount in local currency) as a pending transaction for 3-5 days to verify your identity. This is an authorization, and you might need to contact your card issuer to approve it.
It might take up to 24 hours to fully activate your AWS services. If you can’t access your services after that time, contact support.

Complete your AWS registration
Free account plan access limitations
Free account plans have limited access to certain services and features. Upgrade your account plan to remove limitations. Learn more .

Upgrade planse the most user-friendly services: **AWS App Runner** for the backend (Python) and **AWS Amplify** for the frontend (React).

---

## Phase 0: Create AWS Account (If you haven't already)

1.  Go to [https://aws.amazon.com/](https://aws.amazon.com/) and click **"Create an AWS Account"**.
2.  **Root User Email:** Enter your email address and an account name (e.g., "BellavistaProduction").
3.  **Verify Email:** Check your inbox for the verification code.
4.  **Password:** Create a strong password.
5.  **Contact Info:** Select "Personal" or "Business" and fill in your details.
6.  **Billing Information:** You must provide a credit/debit card.
    *   *Note:* You will be charged a small verification amount (usually $1/£1) which is refunded.
    *   Many services we use have a "Free Tier", but a card is required.
7.  **Identity Verification:** Enter your phone number for a verification code.
8.  **Support Plan:** Choose **"Basic support - Free"**.
9.  **Complete Sign Up:** Wait a few minutes for your account to be active.

## Phase 1: AWS Account Setup

**Note:** If you just created your AWS account, you might see a message saying **"Complete your account setup"** or that services are verifying.
*   **This is normal.** AWS often takes **24 hours** to fully activate new accounts to prevent fraud.
*   **Check your email:** Look for a verification email from AWS and click the link.
*   **Check your payment method:** Ensure your card is verified (AWS might charge $1 and refund it).
*   **If blocked:** You may need to wait until the next day to use services like App Runner or RDS.

1.  **Log in** to the [AWS Console](https://aws.amazon.com/console/).
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
    *   Region: **Europe (London) eu-west-2** (This option is usually at the top of the page).
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

## Phase 4.5: App Runner Environment Configuration (CRITICAL SECURITY)

Your application has **strict security enforcement** in production. You **MUST** set the following environment variables in your App Runner service configuration, or the app will **crash on startup** (this is intentional to prevent insecure deployments).

Go to **App Runner** > **Services** > Your Service > **Configuration** > **Configure** > **Environment variables**:

1.  **FLASK_CONFIG**: `production`
2.  **SECRET_KEY**: Generate a long, random string (e.g., use `openssl rand -hex 32` or a password manager). **DO NOT** use "change-me".
3.  **JWT_SECRET_KEY**: Generate a *different* long, random string.
4.  **DATABASE_URL**: `postgresql://username:password@endpoint:5432/dbname` (from RDS Phase).
5.  **ADMIN_USERNAME**: Your desired admin username (e.g., "bellavista_admin").
6.  **ADMIN_PASSWORD**: A strong, unique password. **DO NOT** use "password" or "admin".
7.  **S3_BUCKET**: `bellavista-uploads-prod` (or your bucket name).
8.  **AWS_ACCESS_KEY_ID**: From IAM setup.
9.  **AWS_SECRET_ACCESS_KEY**: From IAM setup.
10. **ALLOWED_ORIGINS**: `https://master.dxv4enxpqrrf6.amplifyapp.com,https://www.bellavistanursinghomes.com` (Comma separated list of your frontend URLs).

**If you fail to set these, the application will refuse to start.**

## Phase 5: Email Service (SES)

We will use **Amazon SES** to send emails reliably.

1.  Type **"SES"** in the top search bar and click **"Amazon Simple Email Service"**.
2.  On the **left-hand menu**, look under **Configuration** and click **Identities** (or "Verified identities").
3.  Click the orange **Create identity** button.
3.  Select **Email address**.
4.  Enter the email you want to send *from* (e.g., `bellavistacarehomegit@gmail.com` or `admin@yourdomain.com`).
5.  **Create identity**.
6.  Go to your email inbox and click the verification link sent by AWS.
7.  **Sandbox Mode:** By default, you can only send TO verified emails. To send to anyone, you must request "Production Access" in the SES dashboard (takes ~24h).
    *   **How to verify a test email (for Sandbox):**
        1.  Click **Create identity** again.
        2.  Select **Email address**.
        3.  Enter the email you want to send *TO* (e.g., your personal email).
        4.  Click **Create identity**.
        5.  **Important:** Go to that email's inbox, find the email from Amazon Web Services, and click the **verification link**.
        6.  The status in SES will change to "Verified". Now you can send emails to this address.

---

## Phase 5: Deploy Backend (AWS App Runner) - *Recommended*

We will use **AWS App Runner** to host the backend. It is the modern, easiest way to run containers on AWS and includes **HTTPS (SSL)** automatically.

### **Why App Runner?**
*   **Automatic HTTPS:** No complex certificate setup.
*   **Easy Deployment:** Connects directly to GitHub.
*   **Zero Server Management:** No EC2 instances to patch.

### **Step 1: Push Code to GitHub**
Ensure your latest code (with the `Dockerfile`) is pushed to your GitHub repository (`bellavista-backend`).

### **Step 2: Create Service**
1.  Go to the [AWS App Runner Console](https://console.aws.amazon.com/apprunner).
2.  Click **Create an App Runner service**.
3.  **Source:**
    *   Repository type: **Source code repository**.
    *   Provider: **GitHub**.
    *   **Connect to GitHub:** (If not connected, follow the popup to authorize AWS).
    *   Repository: Select your repo (e.g., `bellavista-backend`).
    *   Branch: `main` (or `master`).
    *   Source directory: `/` (Root).
    *   **Deployment settings:** Automatic (deploys every time you push code).
4.  **Next**.

### **Step 3: Configure Build**
1.  **Runtime:** Python 3.
2.  **Build command:** `pip install -r requirements.txt`
3.  **Start command:** `gunicorn wsgi:app --bind 0.0.0.0:8000 --timeout 900 --workers 2 --threads 4 --worker-class gthread`
4.  **Port:** `8000`.
5.  **Next**.

### **Step 4: Configure Service**
1.  **Service name:** `bellavista-api`.
2.  **Virtual CPU & Memory:**
    *   1 vCPU
    *   2 GB Memory (Minimum).
3.  **Environment variables:** (Add these manually)
    *   `FLASK_APP`: `wsgi.py`
    *   `FLASK_ENV`: `production`
    *   `DATABASE_URL`: `postgresql://postgres:PASSWORD@RDS_ENDPOINT:5432/postgres` (From RDS Step)
    *   `S3_BUCKET`: `bellavista-uploads-prod` (From S3 Step)
    *   `AWS_ACCESS_KEY_ID`: (Your IAM User Access Key)
    *   `AWS_SECRET_ACCESS_KEY`: (Your IAM User Secret Key)
    *   `AWS_REGION`: `eu-west-2`
    *   `MAIL_SENDER`: `your-verified-sender@email.com`
    *   `USE_SES`: `true`
4.  **Next** -> **Create & Deploy**.

### **Step 5: Done!**
*   Wait about 5-10 minutes.
*   Once status is **Running**, copy the **Default domain** URL (e.g., `https://x78sfd78.awsapprunner.com`).
*   **This is your Backend API URL.** It is already secure (HTTPS).

---

## Phase 6: Connect Frontend to Backend

1.  Open your frontend project (`bellavista`).
2.  Open `.env` (or create one).
3.  Update the API URL:
    ```env
    VITE_API_BASE_URL=https://x78sfd78.awsapprunner.com/api
    ```
    *(Note: Use `https` and include `/api` at the end)*
4.  **Test Locally:** Run `npm run dev` and check if your local frontend can fetch news from the AWS backend.

---

## Phase 7: Deploy Frontend (AWS Amplify)

For the best experience, deploy your React frontend to **AWS Amplify**.

1.  **Push your code to GitHub**.
2.  Go to **AWS Amplify Console**.
3.  Click **Create new app** -> **Host web app** (GitHub).
4.  Select your repository and branch.
5.  **Build Settings:** Amplify usually detects Vite/React automatically.
    *   Ensure `baseDirectory` is `dist`.
    *   Ensure build command is `npm run build`.
6.  **Environment Variables:**
    *   Add `VITE_API_BASE_URL` = `https://x78sfd78.awsapprunner.com/api`
7.  **Save and Deploy**.

**Congratulations! Your full stack app is now live on AWS with HTTPS.**

---

## Summary of Optimization Changes

1.  **Email System:** We removed the slow, client-side `EmailJS`. Now, the backend sends emails using **AWS SES** asynchronously. This means the user gets an instant "Success" message while the email sends in the background.
2.  **Images:** Configured to upload directly to **S3** for unlimited storage and fast delivery, instead of storing on the server disk.
3.  **Database:** Switched to **PostgreSQL** (RDS) for production reliability.

## Troubleshooting

*   **Images not showing?** Check the S3 Bucket "Block Public Access" settings and ensuring the objects are uploaded with public-read ACLs (the code handles this).
*   **Emails not arriving?** Check AWS SES "Suppression List" or ensure you are out of "Sandbox Mode" if sending to unverified emails.
