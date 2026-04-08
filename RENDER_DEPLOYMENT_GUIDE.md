# Queen Koba - Complete Render Deployment Guide

## 📋 Overview
This guide covers deploying the entire Queen Koba application on Render:
- **Backend**: Flask API (Python) → Render Web Service
- **Frontend**: React app (Vite) → Render Static Site  
- **Admin Panel**: React app (Vite) → Render Static Site
- **Database**: PostgreSQL → Render PostgreSQL

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────┐
│     Render Dashboard                    │
├─────────────────────────────────────────┤
│ Frontend          Admin         Backend  │
│ (Static Site)   (Static Site)  (Web Svc) │
│ React+Vite      React+Vite     Flask    │
└─────┬──────────────┬──────────────┬──────┘
      │              │              │
      └──────────────┴──────────────┘
              ↓
        PostgreSQL DB
        (Render)
```

---

## 🚀 Step 1: Prepare GitHub Repository

### Ensure all code is pushed:
```bash
cd /home/user/projects/qwens-kobas--1-
git status
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## 📊 Step 2: Create PostgreSQL Database on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Create Database:**
   - Click **New +** → **PostgreSQL**
   - Name: `queenkoba-db`
   - Database: `queenkoba`
   - User: `queenkoba_user`
   - Region: Choose closest to your location
   - **Plan**: Starter ($7/month) recommended (Free plan expires after 90 days)
   - Click **Create Database**

3. **Save the connection details:**
   - **Internal Database URL** (for backend): `postgresql://queenkoba_user:PASSWORD@localhost/queenkoba`
   - **External Database URL** (if needed for migrations)

---

## 🔧 Step 3: Deploy Backend API

### 3.1 Create Web Service
1. Click **New +** → **Web Service**
2. Connect GitHub repository
3. Configure as follows:

| Setting | Value |
|---------|-------|
| **Repository** | Your GitHub repo (e.g., `Rotz-kirwa/queen-koba`) |
| **Branch** | `main` |
| **Name** | `queenkoba-backend` |
| **Region** | Same as database |
| **Root Directory** | `backend/koba--backend-only` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r app/requirements.txt` |
| **Start Command** | `gunicorn queenkoba_postgresql:app` |
| **Plan** | Free or Starter ($7/month) |

### 3.2 Add Environment Variables
In Render, go to **Environment** and add these variables:

```
DATABASE_URL = [Copy from PostgreSQL database connection string]
JWT_SECRET_KEY = [Generate: openssl rand -hex 32]
FRONTEND_URL = https://queenkoba-frontend.onrender.com
ADMIN_URL = https://queenkoba-admin.onrender.com
M_PESA_ENV = production
M_PESA_CONSUMER_KEY = [Your Safaricom key]
M_PESA_CONSUMER_SECRET = [Your Safaricom secret]
M_PESA_SHORTCODE = [Your shortcode]
M_PESA_PASSKEY = [Your passkey]
M_PESA_CALLBACK_URL = https://queenkoba-backend.onrender.com/payments/mpesa/callback
M_PESA_TRANSACTION_TYPE = CustomerPayBillOnline
M_PESA_ACCOUNT_REFERENCE = QueenKoba
PYTHON_VERSION = 3.11.0
```

### 3.3 Deploy
- Click **Create Web Service**
- Wait for build to complete (2-5 minutes)
- **Copy the backend URL**: `https://queenkoba-backend.onrender.com`

### 3.4 Test Backend
```bash
curl https://queenkoba-backend.onrender.com/health
```

---

## 🎨 Step 4: Deploy Frontend

### 4.1 Build Frontend
```bash
cd /home/user/projects/qwens-kobas--1-
npm run build:frontend
```

### 4.2 Create Static Site
1. Click **New +** → **Static Site**
2. Connect GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Repository** | `Rotz-kirwa/queen-koba` |
| **Branch** | `main` |
| **Name** | `queenkoba-frontend` |
| **Build Command** | `npm install && npm run build:frontend` |
| **Publish Directory** | `dist` |

4. Click **Create Static Site**
5. Wait for deployment (1-2 minutes)
6. **Copy the frontend URL**: `https://queenkoba-frontend.onrender.com`

---

## 👨‍💼 Step 5: Deploy Admin Panel

### 5.1 Build Admin
```bash
cd /home/user/projects/qwens-kobas--1-
npm run build:admin
```

### 5.2 Create Static Site for Admin
1. Click **New +** → **Static Site**
2. Configure:

| Setting | Value |
|---------|-------|
| **Repository** | `Rotz-kirwa/queen-koba` |
| **Branch** | `main` |
| **Name** | `queenkoba-admin` |
| **Build Command** | `npm install && npm run install:admin && npm run build:admin` |
| **Publish Directory** | `qwen-koba-admin/dist` |

3. Click **Create Static Site**
4. **Copy the admin URL**: `https://queenkoba-admin.onrender.com`

---

## 🔐 Step 6: Configure API Endpoints

After all services are deployed, you need to update the frontend and admin to point to your backend:

### 6.1 Update Environment Variables

Create `.env.production` files (or update existing):

**Frontend** (`/env.production`):
```
VITE_API_URL=https://queenkoba-backend.onrender.com
VITE_ADMIN_URL=https://queenkoba-admin.onrender.com
```

**Admin** (`/qwen-koba-admin/.env.production`):
```
VITE_API_URL=https://queenkoba-backend.onrender.com
```

### 6.2 Redeploy Frontend & Admin
After updating environment variables:
1. Go to frontend service → Click **Manual Deploy**
2. Go to admin service → Click **Manual Deploy**

---

## ✅ Step 7: Verification Checklist

After deployment, verify everything works:

- [ ] Backend health check: `curl https://queenkoba-backend.onrender.com/health`
- [ ] Frontend loads: Visit `https://queenkoba-frontend.onrender.com`
- [ ] Admin panel loads: Visit `https://queenkoba-admin.onrender.com`
- [ ] Products display on frontend
- [ ] Admin can log in
- [ ] Cart functionality works
- [ ] Payment integration works (M-Pesa)
- [ ] Database connections are healthy

---

## 🔒 Important Security Notes

1. **Never commit `.env` files** - use Render's Environment variables only
2. **Regenerate JWT_SECRET_KEY** - use `openssl rand -hex 32`
3. **Update CORS settings** in backend if needed
4. **Use HTTPS everywhere** - Render provides free SSL certificates
5. **Set appropriate FRONTEND_URL and ADMIN_URL** for CORS validation

---

## 📝 Useful Render Commands

**View Logs:**
```bash
# Check Render dashboard for logs of each service
```

**Manually Deploy:**
- Go to service → Click **Manual Deploy** under Deploys tab

**Environment Variables:**
- Service settings → Environment tab

**Rollback:**
- Service → Deploys tab → Click older deployment

---

## 💡 Performance Tips

1. **Use Render's Redis cache** (optional, for sessions)
2. **Enable auto-scaling** on backend if needed
3. **Database backups**: Render handles this automatically
4. **Monitor resource usage** in Render dashboard

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Backend not starting** | Check logs: verify `DATABASE_URL` is set and valid |
| **Frontend 404 errors** | Ensure `Build Command` and `Publish Directory` are correct |
| **CORS errors** | Update `FRONTEND_URL` in backend environment variables |
| **Database connection fails** | Verify `DATABASE_URL` and ensure PostgreSQL service is running |
| **Build fails** | Check build logs, ensure `package.json` exists and dependencies are listed |

---

## 📞 Support Links

- [Render Docs](https://render.com/docs)
- [Render Dashboard](https://dashboard.render.com)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [Static Sites on Render](https://render.com/docs/static-sites)
