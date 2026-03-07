# TEDA — Data Assimilation Benchmarking Platform

> **Real-time interactive benchmarking of ensemble-based data assimilation methods on the Lorenz-96 system.**
> Built with React 18, FastAPI, Plotly.js, and Docker.

---

## ✨ What is TEDA?

TEDA (**T**oolbox for **E**nsemble-based **D**ata **A**ssimilation) is an educational benchmarking platform that lets you configure, run, and compare ensemble DA methods — LETKF, EnKF, and variants — on the **Lorenz-96** chaotic dynamical system in real time.

Results stream live to the browser via **Server-Sent Events (SSE)** and are visualized across six interactive chart types the moment they are computed.

If you use TEDA in research or teaching, please cite:

- Niño-Ruiz, E.D. & Racedo Valbuena, S. *"TEDA: A Computational Toolbox for Teaching Ensemble Based Data Assimilation."* ICCS 2022, Springer. [→ link](https://link.springer.com/chapter/10.1007/978-3-031-08760-8_60)
- Niño-Ruiz, E.D. *"TEDA: A lightweight Python framework for educational data assimilation."* SoftwareX 31 (2025): 102297. [→ DOI](https://doi.org/10.1016/j.softx.2025.102297)

---

## 🚀 Quick Start

```bash
# Clone or unzip the project, then:
docker compose up --build

# Open in browser
open http://localhost:3000
```

That's it. Docker spins up three services — Postgres, the FastAPI backend, and the Nginx-served React frontend — and everything is ready.

To apply source changes and rebuild:

```bash
docker compose down
docker compose up --build
```

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│                                                             │
│   Topbar ──► [Lorenz-96] [Architecture] [Cite] [Help]      │
│   Hero   ──► Title · Logo · Stat strip                     │
│                                                             │
│   ConfigCard ──► useMethods ──► GET /api/methods           │
│       └── MethodTablet (per instance)                       │
│                                                             │
│   RunCard ──► useRunSSE ──► SSE /api/runs/{id}/stream      │
│       ├── 📈 Analysis Error (streaming)                     │
│       ├── 📉 Background vs Analysis                         │
│       ├── 🌊 Ensemble Spread Evolution                      │
│       ├── 🎻 RMSE Distribution Violin                       │
│       └── 📊 Summary: Radar · Polar · Bar · Pareto         │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / SSE
┌──────────────────────────▼──────────────────────────────────┐
│                    FastAPI Backend                           │
│   GET  /api/methods          → method list + schemas        │
│   POST /api/runs             → create run, return run_id    │
│   GET  /api/runs/{id}/stream → SSE real-time results        │
│   GET  /api/runs/{id}/csv    → download results             │
│                    run_service.py                           │
│                    ↓ calls ↓                                │
│               TEDA Python Library                           │
│           (LETKF · EnKF · Lorenz-96 · RK4)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │ asyncpg
┌──────────────────────────▼──────────────────────────────────┐
│                      PostgreSQL                             │
│          runs · method instances · results                  │
└─────────────────────────────────────────────────────────────┘
```

The interactive version of this diagram — with hover tooltips and animated data-flow — is available directly in the app. Click **🗺 Architecture** in the top navigation bar.

---

## 🐳 Services

| Service    | Port | Description                                   |
|------------|------|-----------------------------------------------|
| `frontend` | 3000 | React 18 app served by Nginx                  |
| `backend`  | 8000 | FastAPI (optional direct access)              |
| `postgres` | 5432 | PostgreSQL — persists runs and results        |

All three are defined in `docker-compose.yml` and share a Docker network.

---

## 🛠 Development (hot reload)

For frontend work with instant feedback:

```bash
# 1. Start backend + database
docker compose up postgres backend

# 2. In a separate terminal, run the Vite dev server
cd frontend
npm install
npm run dev
# → http://localhost:5173  (proxies /api/* to localhost:8000)
```

Vite's HMR reflects any change to `.jsx` or `.css` files instantly without a page reload.

---

## 📁 Project Structure

```
teda-react/
├── docker-compose.yml
├── Dockerfile.backend
├── requirements.txt
├── .env
│
├── app/                          # FastAPI backend
│   ├── main.py                   # API routes
│   ├── config.py
│   ├── services/
│   │   └── run_service.py        # Run orchestration + SSE emitter
│   └── persistence/
│       ├── postgres.py           # asyncpg connection pool
│       ├── base.py
│       └── schema.sql
│
└── frontend/                     # React 18 + Vite
    ├── index.html
    ├── vite.config.js
    ├── Dockerfile.frontend
    ├── nginx.conf
    └── src/
        ├── main.jsx
        ├── App.jsx               # Root: state, modals, run handler
        ├── index.css             # Design tokens + global styles
        │
        ├── components/
        │   ├── Topbar.jsx        # Nav chips (Lorenz, Arch, Cite, Help)
        │   ├── Hero.jsx          # Animated title + stat strip
        │   ├── ConfigCard.jsx    # Benchmark configuration panel
        │   ├── RunCard.jsx       # Live results card (6 charts)
        │   ├── ArchDiagram.jsx   # Interactive component map (SVG)
        │   ├── Modal.jsx         # Reusable modal shell
        │   └── Background.jsx    # Decorative animated background
        │
        ├── hooks/
        │   ├── useMethods.js     # Fetches /api/methods on mount
        │   └── useRunSSE.js      # SSE stream → real-time chart data
        │
        └── lib/
            ├── colors.js         # Method color palette + Plotly theme
            └── utils.js          # fmtNum, safeNum, clamp, humanLabel
```

---

## 📊 Charts & Visualizations

Each run produces a **RunCard** with eight interactive Plotly.js charts across five collapsible sections:

| Section | Chart | Description |
|---|---|---|
| 📈 Analysis Error | Streaming line | RMSE over time per method — updates live as the run progresses |
| 📉 Background vs Analysis | Dual line | Solid = analysis, dotted = background — same axis for direct comparison |
| 🌊 Ensemble Spread | Band chart | RMSE ± rolling std deviation — wider band = less stable convergence |
| 🎻 Distribution Fingerprint | Violin plot | Full RMSE distribution per method — narrow violin = stable, wide = chaotic |
| 📊 Summary — Radar | Spider chart | Background vs analysis RMSE across all methods |
| 📊 Summary — Polar | Polar bar | RMSE improvement % per method relative to background |
| 📊 Summary — Runtime | Bar chart | Wall-clock time per method in seconds |
| 📊 Summary — Pareto | Scatter | RMSE vs runtime — visually find the best accuracy/cost tradeoff |

A **KPI strip** above the charts shows at a glance: best RMSE, total CPU time, number of methods completed, and best-vs-worst gain percentage.

All results are also shown in a **data table** and can be exported as **CSV** per run via the ↓ CSV button.

---

## 🌀 The Lorenz-96 Model

The benchmark runs on the Lorenz-96 system:

```
dX_i/dt = (X_{i+1} - X_{i-2}) * X_{i-1}  -  X_i  +  F
          \___ advection ___/                dissip.   forcing
```

with **n = 40** state variables and **forcing F = 8**, placing the system in a strongly chaotic regime (positive Lyapunov exponents). This makes it the canonical testbed for ensemble data assimilation research.

Click **🌀 Lorenz-96 Model** in the app for a full interactive explanation: the equation rendered in LaTeX via KaTeX, a variable-by-variable breakdown, and the physical interpretation of each term.

---

## ⚙️ Configuration Parameters

| Parameter | Default | Description |
|---|---|---|
| `ensemble_size` | 20 | Number of ensemble members |
| `m` | 32 | Number of observations per cycle |
| `std_obs` (σ) | 0.01 | Observation error standard deviation |
| `inf_fact` | 1.04 | Covariance inflation factor |
| `obs_freq` | 0.1 | Observation frequency (time units) |
| `end_time` | 10 | Total simulation window |

Multiple instances of the same method can run simultaneously with different parameters — e.g. **LETKF r=1** vs **LETKF r=2** — for direct side-by-side comparison.

---

## 🔧 Environment Variables

Defined in `.env` at the project root:

```env
POSTGRES_USER=teda
POSTGRES_PASSWORD=teda
POSTGRES_DB=teda
DATABASE_URL=postgresql+asyncpg://teda:teda@postgres:5432/teda
```

---

## 🧩 Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + Vite |
| Animations | Framer Motion |
| Charts | Plotly.js (`plotly.js-dist-min`) |
| Math rendering | KaTeX (npm) |
| Typography | Playfair Display · Figtree · JetBrains Mono |
| Backend | FastAPI + Python |
| Database | PostgreSQL via asyncpg |
| Serving | Nginx (React build + API reverse proxy) |
| Containerization | Docker Compose (3 services) |

---

## 👤 Author

**Elías D. Niño-Ruiz** · [enino84.github.io](https://enino84.github.io) · [AML-CS Lab](https://aml-cs.org)
