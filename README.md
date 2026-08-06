# InvoiciFly Studio (BillCraft) ⚡

> A premium, offline-first client CRM & invoice builder designed for modern freelancers and contractors. Built with zero external backend dependencies using high-fidelity Vanilla JS and dynamic CSS styling.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen.svg)](https://billcraft-nu.vercel.app/)

InvoiciFly is a high-fidelity client CRM and billing manager. It demonstrates how to build robust, offline-first applications leveraging modern web APIs. It includes custom state management, dynamic stylesheet swapping, and offline synchronization features.

---

## 🚀 Key Engineering Implementations

Unlike basic invoice generators, InvoiciFly implements several advanced frontend engineering patterns:

### 1. Dynamic Layout & Theme Engine (CSS Custom Properties)
- Implements a declarative state-driven theme system. Swapping themes (`Midnight Nebula`, `Emerald Mint`, `Royal Gold`, `Arctic Minimal`) instantly updates global CSS custom properties with zero repaint lag.
- Swaps printable design systems dynamically between **Modern Creative**, **Corporate Classic**, and **Minimalist Elegant** by changing high-level class namespaces on the DOM container.

### 2. Custom Offline State Management & Khata Book
- Implements a transaction-safe local state manager synced to `localStorage`.
- Features a Customer Credit Ledger (Khata Book) calculating real-time running balances, transaction history logs, and instant financial reports powered by **Chart.js**.

### 3. Print Layout Engine (Pixel-Perfect A4 Vector PDFs)
- Employs dedicated CSS media query overrides (`@media print`) ensuring vector-clear document layouts.
- Prevents page breaks inside table rows (`page-break-inside: avoid`) and suppresses non-printable UI panels, delivering standard A4 sheets without layout shifts.

### 4. PWA (Progressive Web App) Architecture
- Fully installable offline app using a customized `service-worker.js` cache-first strategies for static assets (HTML, CSS, JS, Fonts).
- Custom responsive layouts adapting fluidly from mobile screens to ultrawide desktop monitors.

---

## 🛠️ Technical Stack

- **Core Engine:** Semantic HTML5, CSS variables, ES6 Class-based JS.
- **Data Visualization:** Chart.js (Modular CDN execution).
- **Offline Sync:** Web Service Workers, Cache Storage API, and Web Manifest schemas.
- **Export Formats:** JSON backup streams, Native Print-to-PDF drivers.

---

## 📂 Project Structure

```text
billcraft/
├── app.js               # Main application logic (CRM, Invoice Builder, Dashboard, Backups)
├── index.html           # Structure and template layout containers
├── style.css            # Custom CSS system (themes, print overrides, animations)
├── manifest.json        # PWA application metadata
├── service-worker.js    # PWA service worker for caching static assets
├── LICENSE              # MIT License
├── CHANGELOG.md         # Release notes and update log
└── README.md            # Project documentation (this file)
```

---

## ⚙️ Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VIPK-GUPTA1827/billcraft.git
   cd billcraft
   ```

2. **Start a local development server:**
   You can run it with any static server. For example:
   ```bash
   npx serve .
   ```
   Or open `index.html` directly in your browser.

---

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

