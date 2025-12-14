# Deployment Guide for Bellavista App

This guide covers how to deploy the full stack application to AWS. The architecture consists of:
- **Frontend**: React (Vite) hosted on S3 + CloudFront (or Amplify)
- **Backend**: Python Flask API hosted on EC2 (or Elastic Beanstalk / App Runner)
- **Database**: PostgreSQL hosted on RDS
- **Storage**: S3 Bucket for images/videos

## Prerequisites
- AWS Account
- Domain name (optional but recommended)
- Docker (optional, for containerized deployment)

---

## 1. Database Setup (AWS RDS)
1. Go to AWS Console > **RDS** > **Create database**.
2. Select **PostgreSQL**.
3. Choose **Free Tier** template.
4. Settings:
   - DB Instance ID: `bellavista-db`
   - Master username: `postgres`
   - Master password: (Create a strong password)
5. Connectivity:
   - Public access: **No** (for security, backend will connect internally) or **Yes** (if you need to connect from your local machine for initial setup, restrict IP to your own).
   - VPC Security Group: Create new, allow port 5432.
6. Create Database.
7. Note down the **Endpoint** (host) once created.

## 2. Storage Setup (AWS S3)
1. Go to **S3** > **Create bucket**.
2. Name: `bellavista-media-assets` (or unique name).
3. Uncheck "Block all public access" (if serving directly) OR keep blocked and use CloudFront (recommended).
   - For simplicity: Uncheck block public access, add Bucket Policy to allow `s3:GetObject` for public.
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
           }
       ]
   }
   ```
4. Update `newsService.js` or backend logic to point to this S3 bucket URL for images if not proxying through backend.
   - *Current App Logic*: The app uploads images to the backend `uploads/` folder.
   - *Production Change*: You should update the backend to upload to S3 instead of local disk.
   - **Alternative**: Use EC2 with a persistent EBS volume for `uploads/` folder if you want to keep current code structure without S3 SDK.

## 3. Backend Deployment (EC2 Method)
This is the most direct way to run your Flask app.

1. **Launch EC2 Instance**:
   - OS: Ubuntu 22.04 LTS
   - Type: t2.micro (Free Tier)
   - Security Group: Allow SSH (22), HTTP (80), HTTPS (443), and Custom TCP (8000).

2. **SSH into Instance**:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Setup Environment**:
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv nginx git
   ```

4. **Clone Repository**:
   ```bash
   git clone <your-repo-url>
   cd production_bellavista_app/backend
   ```

5. **Install Dependencies**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install gunicorn psycopg2-binary
   ```

6. **Configure Environment Variables**:
   Create `.env` file in `backend/`:
   ```bash
   FLASK_CONFIG=production
   DATABASE_URL=postgresql://postgres:PASSWORD@RDS_ENDPOINT:5432/bellavista
   SECRET_KEY=your_secure_secret_key
   ALLOWED_ORIGINS=http://your-frontend-domain.com
   ```

7. **Run with Gunicorn**:
   Test it:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:8000 wsgi:app
   ```

8. **Setup Nginx (Reverse Proxy)**:
   Create config `/etc/nginx/sites-available/bellavista`:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       # Serve uploaded files if using local disk
       location /uploads/ {
           alias /home/ubuntu/production_bellavista_app/backend/uploads/;
       }
   }
   ```
   Enable it:
   ```bash
   sudo ln -s /etc/nginx/sites-available/bellavista /etc/nginx/sites-enabled
   sudo systemctl restart nginx
   ```

9. **Setup Systemd Service**:
   Create `/etc/systemd/system/bellavista.service` to keep app running.

## 4. Frontend Deployment (AWS Amplify or S3+CloudFront)
**Easiest Method: AWS Amplify**

1. Go to **AWS Amplify**.
2. Connect your Git repository.
3. Select the branch (main).
4. Build Settings:
   - Base directory: `bellavista` (since your react app is in this subfolder)
   - Build command: `npm install && npm run build`
   - Output directory: `dist`
5. **Environment Variables**:
   - Add `VITE_API_BASE_URL`: `http://your-ec2-ip/api` (or `https://api.yourdomain.com/api`)
6. Deploy.

**Manual Method (S3 + CloudFront)**:
1. Local Build:
   ```bash
   cd bellavista
   npm run build
   ```
2. Upload `dist` folder contents to an S3 bucket (configured for static website hosting).
3. Create CloudFront Distribution pointing to S3 bucket (for HTTPS and caching).

## 5. Final Checklist
- [ ] **CORS**: Ensure backend `ALLOWED_ORIGINS` includes your frontend URL.
- [ ] **Database**: Run `flask shell` -> `db.create_all()` on the server to initialize tables.
- [ ] **Media**: If using local uploads, ensure `uploads/` folder has write permissions (`chmod 755`).
- [ ] **HTTPS**: Use Certbot on EC2 for backend SSL. Amplify handles frontend SSL automatically.

## 6. CI/CD (Optional)
Use GitHub Actions to auto-deploy when you push to main.
