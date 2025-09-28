# 🚀 Custom Deployment Commands for NihalTalla

## Step 1: Upload to GitHub

### Create GitHub Repository First:
1. Go to [github.com](https://github.com)
2. Sign in with your account (NihalTalla)
3. Click "+" → "New repository"
4. Repository name: `form-filling-app`
5. Set to Public
6. DON'T initialize with README
7. Click "Create repository"

### Upload Your Code:
Run these exact commands in your project folder:

```bash
cd C:\Users\talla\OneDrive\Desktop\demo
git remote add origin https://github.com/NihalTalla/form-filling-app.git
git branch -M main
git push -u origin main
```

### Expected Output:
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Delta compression using up to X threads
Compressing objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), XXX.XX KiB | XXX.XX MiB/s, done.
Total XX (delta X), reused 0 (delta 0), pack-reused 0
To https://github.com/NihalTalla/form-filling-app.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

---

## Step 2: Deploy Backend to Railway

### Railway URLs:
- **Main Site**: [railway.app](https://railway.app)
- **Project Dashboard**: After deployment, will be like: `https://railway.app/project/xxxxxxxx`

### Configuration for Railway:
- **Repository**: `https://github.com/NihalTalla/form-filling-app`
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Your Backend URL will be:
`https://backend-production-xxxx.up.railway.app`

---

## Step 3: Deploy Frontend to Vercel

### Vercel URLs:
- **Main Site**: [vercel.com](https://vercel.com)
- **Project Import**: [vercel.com/new](https://vercel.com/new)

### Configuration for Vercel:
- **Repository**: `https://github.com/NihalTalla/form-filling-app`
- **Framework**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variable for Vercel:
```
VITE_API_URL=https://backend-production-xxxx.up.railway.app
```
(Replace xxxx with your actual Railway URL)

### Your Frontend URL will be:
`https://form-filling-app-nihaltalla.vercel.app`

---

## Step 4: Connect Your GoDaddy Domain

### In Vercel Dashboard:
1. Go to your project → Settings → Domains
2. Add your GoDaddy domain
3. Vercel will show DNS records needed

### In GoDaddy:
- **A Record**: `@` → `76.76.19.61`
- **CNAME**: `www` → `cname.vercel-dns.com`

---

## ✅ Quick Checklist:

- [ ] Create GitHub repository `form-filling-app`
- [ ] Run upload commands with your username
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel  
- [ ] Connect GoDaddy domain
- [ ] Test live application

---

## 🆘 Next Action:

**Ready to upload to GitHub?** 

Run the commands above after creating your GitHub repository!