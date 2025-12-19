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

## Phase 4: Email Service (SES)

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

## Phase 5:### Step 4: Deploy Backend (AWS Elastic Beanstalk) - *Free Tier Eligible*

**Comparison: Is there a better free option?**
| Provider | Free Tier | "Always On" (Speed) | Ease of Use |
| :--- | :--- | :--- | :--- |
| **AWS Elastic Beanstalk** | Free (12 mos) | **Yes** (Fast) | Hard (Complex setup) |
| **Render.com** | Free (Forever) | **No** (Sleeps after 15m) | **Very Easy** |
| **AWS Lambda** | Free (Forever) | **No** (Cold starts) | Very Hard (Needs adapters) |
| **Oracle Cloud** | Free (Forever) | **Yes** (Fast) | Very Hard (UX is terrible) |

**Verdict:**
*   If you want **Speed** (no sleeping) and **AWS Experience**: Stick with **Elastic Beanstalk**.
*   If you want **Simplicity** and don't care if the first request takes 30s: Go with **Render.com**.

**Cost Analysis (Elastic Beanstalk):**
*   **First 12 Months:** **$0** (Free Tier).
*   **After 12 Months:** Approximately **$10 - $15 per month**.
    *   This pays for the EC2 server (t3.micro) that runs 24/7.
    *   *Tip:* We will use "Single Instance" mode to avoid paying for a Load Balancer (which costs extra).

**Configuration Files:**
Before deploying, we need to tell Elastic Beanstalk how to run our app.
1.  I have created a file called `Procfile` in your project root.
2.  It contains: `web: gunicorn --chdir backend wsgi:app`
3.  **Push this file to GitHub** before continuing!

**Deployment Steps:**
1.  **Search:** Type **"Elastic Beanstalk"** in AWS and click it.
2.  **Create Application:** Click orange **Create application**.
3.  **Configure:**
    *   **Application Name:** `bellavista-backend`
    *   **Platform:** `Python`
    *   **Platform Branch:** `Python 3.11 running on 64bit Amazon Linux 2023` (or latest).
    *   **Platform Version:** Recommended (default).
4.  **Application Code:**
    *   Select **Upload your code** -> **Public S3 URL** (Not recommended for you) OR just **Sample application** for now to get it created, then we connect GitHub.
    *   *Better Method:* Select **Upload your code** -> **Local file** -> Upload a zip of your project?
    *   *Best Method for you:* Let's use **"Sample application"** first to create the environment. Then we will connect GitHub.
    *   Select **Sample application**.
5.  **Presets:** Select **Single instance (free tier eligible)**. *Crucial step to avoid costs!*
6.  **Next** -> **Skip to Review** -> **Submit**.
    *   *Wait:* This takes about 5-10 minutes. It will turn "Green" (Ok).

**Connect GitHub (Once Environment is Ready):**
1.  Go to your new Environment (e.g., `Bellavistabackend-env`).
2.  Click **Upload and deploy**.
3.  (If available) Click **Deploy** button or configure **CodePipeline** to connect GitHub.
    *   *Actually, the easiest way with GitHub is AWS CodePipeline.*
    *   **Let's stick to the simplest manual upload for now:**
        1.  Zip your project folder.
        2.  Click **Upload and deploy**.
        3.  Upload the zip.
        4.  Deploy.

**Setting Environment Variables (CRITICAL):**
1.  Go to **Configuration** (left menu) -> **Updates, monitoring, and logging**.
2.  Scroll to **Environment properties**.
3.  Click **Edit**.
4.  Add your variables:
    *   `FLASK_CONFIG` = `production`
    *   `DATABASE_URL` = *(Your RDS URL)*
    *   `AWS_ACCESS_KEY_ID` = ...
    *   `AWS_SECRET_ACCESS_KEY` = ...
    *   `AWS_REGION_NAME` = `us-east-1`
    *   `S3_BUCKET_NAME` = ...
    *   `SENDER_EMAIL` = ...
5.  Click **Apply**.

**The URL:**
Once green, look for the **Domain** link at the top (e.g., `bellavista.us-east-1.elasticbeanstalk.com`). This is your backend URL.

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
