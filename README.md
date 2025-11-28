# AgriConnect Monorepo (TerraSyntro)

AgriConnect is an end-to-end platform that connects farmers, agri-input sellers, and experts through a modern marketplace, logistics tooling, and AI-assisted agronomy services. This repository contains both the **Next.js frontend** and the **Node.js/Express backend** (plus a lightweight Python ML microservice) that power the experience.

## ✨ Core Capabilities

- 🌾 **Marketplace:** Browse, list, and manage crops, fertilizers, and agri-inputs with rich media and pricing tools.
- 🛒 **Cart & Orders:** Persistent shopping cart, checkout orchestration, and granular order status tracking.
- 🧑‍🤝‍🧑 **Community Forum:** Category-based discussions, replies, and engagement analytics to crowdsource knowledge.
- 🔐 **Secure Auth:** JWT-protected APIs, session helpers on the frontend, and bcrypt-hashed credentials.
- 🤖 **AI & Data Services:** Plant identification via Pl@ntNet, crop info via Trefle, and an on-device disease detection model served by Python.
- 📦 **File & Media Handling:** Secure image uploads for listings and diagnostics with Multer validation.

## 📁 Repository Layout

```
.
├── backend/            # Express API, Mongo models, services, uploads
├── frontend/           # Next.js 14 app router UI with Tailwind & framer-motion
├── env.zip             # Do NOT commit: archived environment bundle (ignored)
├── .eslintrc.json      # Monorepo-level lint config consumed by Next.js
├── .gitignore          # Ignore rules shared by both apps
└── README.md           # ← you are here
```

> ℹ️ The backend also calls into `services/app.py` and `services/model.py`. Install the Python requirements listed in `backend/requirements.txt` when you want to enable ML features locally.

## 🛠️ Tech Stack

| Layer      | Technologies |
|------------|--------------|
| Frontend   | Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, framer-motion, Radix UI, lucide-react |
| Backend    | Node.js, Express.js, MongoDB + Mongoose, Multer, JWT, bcryptjs, Axios |
| ML/Services| Python 3, FastAPI/Flask-like service (see `services/app.py`), PyTorch model `plant_disease_model_1.pt` |
| Tooling    | ESLint, TypeScript, Nodemon, Mailchimp SDK, Razorpay SDK |

## 🚀 Quick Start

### 1. Clone & prerequisites

```bash
git clone <repo-url>
cd agriconnect main - Copy
# Required: Node.js ≥18, npm, Python ≥3.10, and a running MongoDB instance.
```

### 2. Backend setup (`backend/`)

```bash
cd backend
npm install
cp .env.example .env   # populate the values described below

# (Optional but recommended) Python ML service
python -m venv env
env\Scripts\activate           # Windows PowerShell
pip install -r requirements.txt
python services/app.py          # serves disease detection endpoints
```

Backend environment variables (`.env`):

```
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/agriconnect
JWT_SECRET=your_secure_secret
TREFLE_API_KEY=...
PLANTNET_API_KEY=...
FRONTEND_URL=http://localhost:3000
```

Start the API:

```bash
npm run dev         # hot reload via nodemon
# npm start         # production mode
```

### 3. Frontend setup (`frontend/`)

```bash
cd ../frontend
npm install

npm run dev         # Next.js dev server on http://localhost:3000
# npm run build && npm run start  # production build & serve
```

If you add environment variables for the UI (e.g., API base URLs, public analytics keys), follow the Next.js convention using `.env.local` and prefix public values with `NEXT_PUBLIC_`.

## 🧪 Useful Scripts

| Location  | Command            | Description |
|-----------|-------------------|-------------|
| backend   | `npm run dev`     | Start Express server with Nodemon |
| backend   | `npm start`       | Production server process |
| frontend  | `npm run dev`     | Next.js development server |
| frontend  | `npm run build`   | Create optimized production build |
| frontend  | `npm run start`   | Serve the build output |
| frontend  | `npm run lint`    | Run ESLint against the app directory |

## 🧱 Additional Notes

- **Uploads & temp files** are ignored via `.gitignore` (`uploads/`, `.next/`, `backend/env/`, etc.). Verify sensitive assets stay outside version control before pushing.
- **MongoDB** must be running locally or via a remote cluster URI for the backend to boot.
- **Mailchimp, Razorpay, and other SDKs** require their own credentials; add them to your `.env` or secret manager when integrating.
- **Python service** communicates with the Node backend through HTTP. Ensure the port in `services/app.py` matches what `server.js` expects.

## 📄 Licensing & Contributions

The backend ships with MIT metadata; feel free to adapt the license statement to cover the entire monorepo. Contributions are welcome—open an issue or PR once you have a feature branch ready.

---

Need more context (API shapes, UI flows, deployment tips)? Check `backend/README.md` for deep API documentation, or open an issue describing what you’d like to see added here. Happy hacking! 🌱
