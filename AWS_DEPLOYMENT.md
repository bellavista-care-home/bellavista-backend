# AWS Deployment Guide for Bellavista App

This guide outlines how to deploy your full-stack application (React Frontend, Python Flask Backend, SQLite/PostgreSQL Database) to AWS.

## Architecture Overview

- **Frontend**: React App -> AWS Amplify (recommended) or S3 + CloudFront.
- **Backend**: Flask API -> AWS Elastic Beanstalk (recommended) or EC2.
- **Database**: AWS RDS (PostgreSQL or MySQL) replaces the local SQLite file.
- **Media Storage**: AWS S3 Bucket for storing uploaded images/videos.

---

## Step 1: Media Storage (AWS S3)

Since your app handles image uploads, you cannot store them on the server disk (as you do locally) because cloud servers are ephemeral (files are lost on restart). You must use S3.

1.  **Create an S3 Bucket**:
    *   Go to AWS Console > S3 > Create bucket.
    *   Name: e.g., `bellavista-media-assets`.
    *   Region: Choose one close to your users (e.g., `eu-west-2` for London).
    *   Uncheck "Block all public access" (you need images to be readable).
    *   Update Bucket Policy to allow public read access for objects.

2.  **Create IAM User for Backend**:
    *   Go to IAM > Users > Create user.
    *   Name: `bellavista-backend-user`.
    *   Attach policies: `AmazonS3FullAccess` (or a more restrictive policy for just your bucket).
    *   Create Access Keys (Access Key ID and Secret Access Key). **Save these!**

3.  **Update Backend Code**:
    *   Install `boto3`: `pip install boto3`.
    *   Modify `routes.py` to upload to S3 instead of saving locally.
    *   Example snippet:
        ```python
        import boto3
        s3 = boto3.client('s3', aws_access_key_id='...', aws_secret_access_key='...')
        s3.upload_fileobj(file, 'bucket-name', filename, ExtraArgs={'ACL': 'public-read'})
        url = f"https://bucket-name.s3.amazonaws.com/{filename}"
        ```

---

## Step 2: Database (AWS RDS)

SQLite is not suitable for production serverless/scalable environments. Use PostgreSQL.

1.  **Create RDS Instance**:
    *   Go to RDS > Create database.
    *   Engine: PostgreSQL.
    *   Template: Free Tier.
    *   Master username/password: **Save these!**
    *   Public access: Yes (for now, to connect from local/backend).

2.  **Update Backend Config**:
    *   Install `psycopg2-binary`.
    *   Update `SQLALCHEMY_DATABASE_URI` in `config.py`:
        `postgresql://username:password@endpoint:5432/dbname`

---

## Step 3: Backend Deployment (Elastic Beanstalk)

Elastic Beanstalk (EB) manages the infrastructure for you.

1.  **Prepare Backend**:
    *   Ensure `requirements.txt` is up to date (`pip freeze > requirements.txt`).
    *   Create a `.ebextensions` folder if needed for custom config.
    *   Ensure `application = app` variable exists in `wsgi.py` or `app.py`.

2.  **Deploy**:
    *   Install EB CLI (`pip install awsebcli`).
    *   Run `eb init` inside `backend/` folder.
    *   Run `eb create bellavista-env`.
    *   Set Environment Variables in EB Console (Software configuration):
        *   `DATABASE_URL`
        *   `AWS_ACCESS_KEY_ID`
        *   `AWS_SECRET_ACCESS_KEY`
        *   `S3_BUCKET_NAME`

---

## Step 4: Frontend Deployment (AWS Amplify)

Amplify is the easiest way to deploy React apps.

1.  **Connect Repository**:
    *   Go to AWS Amplify > New App > Host web app.
    *   Select GitHub (push your code to GitHub first).
    *   Select your repository and branch.

2.  **Build Settings**:
    *   Amplify usually detects them automatically.
    *   Base directory: `bellavista`.
    *   Build command: `npm run build`.
    *   Output directory: `dist`.

3.  **Environment Variables**:
    *   Add `VITE_API_BASE_URL` pointing to your Elastic Beanstalk URL (e.g., `http://bellavista-backend-env.eba-7zhec9xm.eu-west-2.elasticbeanstalk.com/api`).

4.  **Deploy**:
    *   Click "Save and Deploy".

---

## Summary of Required Code Changes

1.  **Backend (`routes.py`)**: Replace local file save with S3 upload.
2.  **Backend (`config.py`)**: Use `os.environ.get('DATABASE_URL')` for DB connection.
3.  **Frontend (`.env`)**: Set `VITE_API_URL` to the production backend URL.

This setup ensures a scalable, production-ready application.
