# InvoiciFly Studio (BillCraft)

> A premium, offline-first invoice builder & client CRM manager built for modern freelancers and small business owners.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen.svg)](https://billcraft-nu.vercel.app/)

InvoiciFly is a high-fidelity billing application designed to solve real-world invoicing struggles. It enables users to create professional invoices, manage client relationships (CRM), monitor payment history, track customer credit ledgers (Khata Book), and download beautiful print-ready PDF receipts in a single click.

---

## ✨ Features

- **🎨 Multi-Theme Support**: Choose from curated color schemes like *Midnight Nebula*, *Emerald Mint*, *Royal Gold*, and *Arctic Minimal*.
- **📐 Layout Styles**: Swap print layouts instantly between *Modern Creative*, *Corporate Classic*, and *Minimalist Elegant*.
- **👤 Clients CRM**: Save client addresses and contact info to a local CRM catalog for instant auto-complete and selection during invoice generation.
- **📖 Credit Ledger (Khata Book)**: Keep track of outstanding balances, payments, and invoice histories per client.
- **📈 Analytics Dashboard**: Visualize financial progress with cards showing total earnings, pending invoices, and a gorgeous growth chart powered by Chart.js.
- **💾 Secure Backup & Restore**: Export all app records (CRM, products, invoices) to a secure JSON file and restore it on any device.
- **⚡ Offline-First (PWA)**: Installed as a Progressive Web App (PWA) with offline support via service workers.

---

## 🛠️ Tech Stack

- **Frontend**: Semantic HTML5, CSS Variables, ES6 JavaScript.
- **Charts**: Chart.js (via CDN).
- **Icons & Fonts**: Google Fonts (Plus Jakarta Sans & Outfit), SVG custom paths.
- **Database / Persistence**: Browser LocalStorage & JSON backup streams.
- **Hosting**: Deployed on Vercel.

---

## 🚀 Quick Start

To run this application locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/VIPK-GUPTA1827/billcraft.git
   cd billcraft
   ```

2. Open the application:
   - Simply open `index.html` in any web browser.
   - Or, run a local development server (e.g. using VS Code's Live Server extension).

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

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with passion as part of the **Digital Heroes** Developer Program.*
