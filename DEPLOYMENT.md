# StudyMate - Deployment Guide

This guide covers deploying StudyMate to production environments.

## 🚀 Production Deployment Options

### Option 1: Deploy on Heroku

#### Backend Deployment

1. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku app**
```bash
cd backend
heroku create your-app-name
```

3. **Add MySQL Database**
```bash
# Using JawsDB (MySQL add-on)
heroku addons:create jawsdb:kitefin -a your-app-name
```

4. **Configure environment variables**
```bash
heroku config:set JWT_SECRET=your_secret_key -a your-app-name
heroku config:set NODE_ENV=production -a your-app-name
```

5. **Deploy**
```bash
git push heroku main
```

6. **Run migrations**
```bash
heroku run "node -e \"require('mysql2/promise').createConnection({...}).then(conn => conn.execute(fs.readFileSync(...).toString()))\"" -a your-app-name
```

#### Frontend Deployment (Netlify)

1. **Build frontend (if using build tool)**
```bash
cd frontend
npm run build  # If using build system
```

2. **Deploy to Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=frontend
```

3. **Update API_BASE_URL** in `script.js`:
```javascript
const API_BASE_URL = 'https://your-heroku-app.herokuapp.com/api';
```

---

### Option 2: Deploy on AWS

#### Using EC2

1. **Launch EC2 instance**
   - Ubuntu 20.04 LTS
   - t2.micro (free tier eligible)

2. **Connect via SSH**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install MySQL**
```bash
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

5. **Clone and setup project**
```bash
git clone your-repo-url
cd StudyMate/backend
npm install
```

6. **Configure environment variables**
```bash
nano .env
# Add your configuration
```

7. **Run with PM2** (process manager)
```bash
npm install -g pm2
pm2 start server.js --name "studymate"
pm2 save
```

8. **Setup reverse proxy with Nginx**
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /uploads {
        alias /home/ubuntu/StudyMate/backend/uploads;
    }
}
```

---

### Option 3: Deploy on DigitalOcean

1. **Create Droplet**
   - Ubuntu 20.04 LTS
   - $5/month plan

2. **SSH into droplet**
```bash
ssh root@your-droplet-ip
```

3. **Follow AWS setup steps above** (same procedure)

4. **Add SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

---

### Option 4: Deploy with Docker

1. **Create Dockerfile** (in backend)
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

2. **Create docker-compose.yml**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: db
      DB_USER: root
      DB_PASSWORD: password
      DB_NAME: studymate_db
      JWT_SECRET: your_secret
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: studymate_db
    volumes:
      - ./database/studymate.sql:/docker-entrypoint-initdb.d/init.sql
      - db_data:/var/lib/mysql

  frontend:
    image: node:16-alpine
    working_dir: /app
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"
    command: npx http-server -p 3000

volumes:
  db_data:
```

3. **Run with Docker**
```bash
docker-compose up -d
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit `.env` file
- Use strong JWT_SECRET (32+ characters)
- Use different secrets for dev and production

### 2. HTTPS/SSL
```bash
# Always use HTTPS in production
# Get SSL certificate from Let's Encrypt (free)
sudo certbot certonly --standalone -d your-domain.com
```

### 3. Database Security
```sql
-- Create limited user for app
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON studymate_db.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. CORS Configuration
```javascript
// backend/server.js
app.use(cors({
    origin: 'https://your-frontend-domain.com',
    credentials: true
}));
```

### 5. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📊 Performance Optimization

### 1. Database
```sql
-- Add indexes for faster queries
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_task_user ON tasks(user_id);
CREATE INDEX idx_schedule_date ON schedules(study_date);
```

### 2. Backend
- Use connection pooling (already implemented)
- Enable gzip compression
- Cache responses with Redis (optional)

### 3. Frontend
- Minify CSS and JavaScript
- Lazy load images
- Use service workers for offline support

---

## 📈 Monitoring & Maintenance

### 1. Logging
```javascript
// Add logging to server.js
const fs = require('fs');
const path = require('path');

const logStream = fs.createWriteStream(
    path.join(__dirname, 'logs', 'app.log'),
    { flags: 'a' }
);

app.use((req, res, next) => {
    logStream.write(`${new Date().toISOString()} - ${req.method} ${req.path}\n`);
    next();
});
```

### 2. Uptime Monitoring
- Use UptimeRobot for free monitoring
- Set up email alerts

### 3. Database Backups
```bash
# Daily backup script
#!/bin/bash
mysqldump -u root -p studymate_db > backup_$(date +%Y%m%d).sql
```

### 4. Log Rotation
```bash
sudo apt-get install logrotate
# Configure log rotation for PM2 logs
```

---

## 🔄 CI/CD Pipeline Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    
    - name: Install dependencies
      run: |
        cd backend
        npm install
    
    - name: Run tests
      run: |
        cd backend
        npm test
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: your-app-name
        heroku_email: your-email@example.com
        usedocker: true
```

---

## ✅ Pre-Launch Checklist

- [ ] Update all environment variables
- [ ] Set NODE_ENV=production
- [ ] Configure CORS properly
- [ ] Set up SSL/HTTPS
- [ ] Configure database backups
- [ ] Test all features in production
- [ ] Set up monitoring/alerts
- [ ] Create admin user
- [ ] Document deployment process
- [ ] Set up error tracking (Sentry)
- [ ] Configure email notifications
- [ ] Test file uploads
- [ ] Verify PDF export
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Performance testing
- [ ] Load testing

---

## 🆘 Troubleshooting

### "Cannot connect to database in production"
- Check connection string in .env
- Verify database user permissions
- Check firewall rules
- Test connection manually

### "CORS errors in production"
- Update CORS origin in server.js
- Check frontend domain matches exactly
- Include protocol (https://)

### "Files not uploading"
- Check upload directory permissions
- Verify disk space available
- Check file size limits
- Review server logs

### "High memory usage"
- Check for memory leaks
- Enable connection pooling
- Add rate limiting
- Monitor with PM2

---

## 📞 Support & Resources

- **Heroku**: https://devcenter.heroku.com/
- **AWS EC2**: https://docs.aws.amazon.com/ec2/
- **DigitalOcean**: https://docs.digitalocean.com/
- **Docker**: https://docs.docker.com/
- **PM2**: https://pm2.keymetrics.io/

---

**Ready to deploy? Good luck! 🚀**
