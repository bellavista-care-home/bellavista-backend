# Bellavista Care Home App - AWS Deployment Guide

This guide covers how to deploy the Bellavista application to AWS. The architecture consists of:
- **Frontend**: React (hosted on S3 + CloudFront)
- **Backend**: Flask (hosted on Elastic Beanstalk or EC2)
- **Database**: PostgreSQL (hosted on RDS)
- **Media Storage**: S3 (for news images/videos)

## Prerequisites
1.  **AWS Account**: Create one at [aws.amazon.com](https://aws.amazon.com/).
2.  **AWS CLI**: Install and configure (`aws configure`).
3.  **Domain Name** (Optional but recommended): Managed via Route 53 or another registrar.

---

## Step 1: Database (RDS)

1.  Go to the **RDS Console**.
2.  Click **Create database**.
3.  Select **PostgreSQL**.
4.  Choose **Free Tier** (if eligible) or **Dev/Test**.
5.  **Settings**:
    -   Master username: `postgres`
    -   Master password: (create a strong password)
6.  **Connectivity**:
    -   Public access: **No** (for security; backend will connect from within AWS).
    -   VPC Security Group: Create new (e.g., `bellavista-db-sg`).
7.  Create the database.
8.  **Note the Endpoint** once created (e.g., `bellavista-db.xxxx.eu-west-2.rds.amazonaws.com`).

---

## Step 2: Media Storage (S3)

1.  Go to the **S3 Console**.
2.  Click **Create bucket**.
3.  Name: e.g., `bellavista-media-assets`.
4.  Region: `eu-west-2` (London) or your preferred region.
5.  **Block Public Access settings**:
    -   Uncheck "Block all public access" (we need images to be readable by the public).
    -   Acknowledge the warning.
6.  Create bucket.
7.  **Bucket Policy**: Go to Permissions > Bucket Policy and add:
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::bellavista-media-assets/*"
            }
        ]
    }
    ```
8.  **CORS Configuration**: Go to Permissions > CORS and add:
    ```json
    [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": []
        }
    ]
    ```

---

## Step 3: Backend (Elastic Beanstalk)

1.  **Prepare the Backend Code**:
    -   Ensure `requirements.txt` includes `boto3`, `gunicorn`, `psycopg2-binary` (Already done).
    -   Ensure `wsgi.py` exists (Flask entry point).
    
2.  **Create Application**:
    -   Go to **Elastic Beanstalk**.
    -   Create Application > Name: `bellavista-backend`.
    -   Platform: **Python 3.11** (or matching your local version).

3.  **Configure Environment**:
    -   Select "Upload your code" -> Upload a zip of the `backend` folder.
    -   Click **Configure more options**.
    -   **Software** (Environment Properties):
        Add the following variables:
        -   `FLASK_APP`: `wsgi.py`
        -   `FLASK_ENV`: `production`
        -   `DATABASE_URL`: `postgresql://postgres:PASSWORD@RDS_ENDPOINT:5432/postgres`
        -   `S3_BUCKET`: `bellavista-media-assets`
        -   `AWS_ACCESS_KEY_ID`: (Your IAM User Access Key)
        -   `AWS_SECRET_ACCESS_KEY`: (Your IAM User Secret Key)
        -   `AWS_REGION`: `eu-west-2`
    
4.  **Create Environment**.
5.  Once deployed, note the **URL** (e.g., `http://bellavista-backend.env.elasticbeanstalk.com`).

---

## Step 4: Frontend (S3 + CloudFront)

1.  **Configure API URL**:
    -   Create a file named `.env.production` in the `bellavista` folder.
    -   Add the following line:
        ```
        VITE_API_BASE_URL=https://bellavista-backend.env.elasticbeanstalk.com/api
        ```
        (Replace with your actual Backend URL from Step 3, ensuring `/api` is appended if your backend routes are prefixed with it. Based on the code, routes are under `/api`, so append `/api`).
    
2.  **Build React App**:
    ```bash
    cd bellavista
    npm run build
    ```
    This creates a `build` (or `dist`) folder.

3.  **Create Frontend Bucket**:
    -   Create a NEW S3 bucket (e.g., `bellavista-frontend`).
    -   Enable **Static Website Hosting** in Properties.
    -   Upload the contents of the `dist` (or `build`) folder to this bucket.

4.  **CloudFront (CDN)**:
    -   Go to **CloudFront**.
    -   Create Distribution.
    -   Origin Domain: Select your S3 bucket website endpoint.
    -   Viewer Protocol Policy: **Redirect HTTP to HTTPS**.
    -   Create Distribution.

5.  **Final URL**: Your CloudFront domain (e.g., `d12345.cloudfront.net`) is your live site URL.

---

## Step 5: IAM User for Backend

To allow the backend to upload to S3:
1.  Go to **IAM Console**.
2.  Users > Create User (e.g., `bellavista-backend-user`).
3.  Permissions: Attach policies directly > **AmazonS3FullAccess**.
4.  Create Access Keys (for CLI/SDK) > Save the Access Key ID and Secret Access Key.
5.  Use these keys in Step 3 (Environment Variables).

---

## Troubleshooting

-   **Database Connection**: Ensure the Security Group for RDS allows inbound traffic on port 5432 from the Elastic Beanstalk Security Group.
-   **CORS Errors**: Ensure `backend/app/__init__.py` allows the CloudFront domain in CORS settings.
    -   Set `ALLOWED_ORIGINS` env var in Elastic Beanstalk to your CloudFront URL.
