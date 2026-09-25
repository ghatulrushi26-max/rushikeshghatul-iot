# Rushikesh D. Ghatul — Electrical Engineering Portfolio

A modern, responsive, and recruiter-focused personal portfolio website for **Rushikesh D. Ghatul**, an Electrical Engineering student at **Government College of Engineering, Yavatmal**.

Built specifically for high-speed static hosting on **GitHub Pages** using clean, semantic **HTML5**, modern **Vanilla CSS**, and lightweight **Vanilla JavaScript**.

---

## ⚡ Live Features

- **Recruiter-Focused Layout:** Direct access to Resume, Academic Timeline, Internships, Technical Skills, and Contact Form.
- **Dynamic Certificate Gallery (`js/certificates.js`):** Add unlimited certificates (PDF or images) by simply editing a data file without touching HTML!
  - 8+ Filter Categories: *Internship, Achievement, Workshop, Course, Training, Participation, Industrial Visit, Other*.
  - Integrated Lightbox & PDF Viewer with direct Download buttons.
- **Dynamic Projects Portfolio (`js/projects.js`):** Filter by *Renewable Energy, Power Systems, Industrial Automation, and Academic Projects*. Displays "Coming Soon" badges gracefully for missing URLs.
- **Interactive Resume Section:** Ready-to-view and download PDF resume at `assets/Rushikesh_D_Ghatul_Resume.pdf`.
- **Engineering Visual Theme:** Dark mode by default with electric cyan and amber accents, plus a 1-click Light Mode toggle.
- **100% Mobile & Desktop Responsive:** Optimized hamburger menu, fluid typography, and touch-friendly controls.
- **Zero-Dependency Architecture:** Immediate local preview (`file:///`) and instant deployment to GitHub Pages without complex build steps or failing CI pipelines.

---

## 📁 Project Directory Structure

```text
rushikesh/
├── index.html                           # Main portfolio single-page application
├── assets/
│   ├── images/                          # Profile avatar, favicon, graphics
│   │   ├── profile-rushikesh.svg
│   │   └── favicon.svg
│   ├── certificates/                    # PDF and image certificate files
│   │   ├── msedcl-internship-sample.pdf
│   │   ├── plc-scada-sample.pdf
│   │   ├── solar-pv-sample.pdf
│   │   ├── industrial-visit-cstps.pdf
│   │   └── sample-certificate.pdf
│   ├── achievements/                    # Proofs, award photos
│   ├── internships/                     # Internship photos and reports
│   ├── projects/                        # Project diagrams and screenshots
│   ├── industrial-visits/               # Industrial visit photos
│   └── Rushikesh_D_Ghatul_Resume.pdf    # Master resume PDF
├── css/
│   └── style.css                        # Complete modern responsive styling & themes
├── js/
│   ├── certificates.js                  # Certificate database (Add your certificates here)
│   ├── projects.js                      # Project database (Add/edit projects here)
│   └── main.js                          # Theme switcher, scrollspy, modal viewer & filters
├── .gitignore                           # Git ignore rules
└── README.md                            # Documentation and deployment guide
```

---

## 🚀 How to Deploy on GitHub Pages (Step-by-Step)

Follow these simple steps to publish your portfolio online for free with a permanent `https://your-username.github.io/portfolio/` URL.

### Step 1: Create a GitHub Repository
1. Log in to [GitHub](https://github.com).
2. Click the **+** (plus) icon in the top-right corner and choose **New repository**.
3. Name your repository:
   - For a custom portfolio URL: name it `portfolio` (URL will be `https://<username>.github.io/portfolio/`).
   - Or name it exactly `<username>.github.io` to make it your primary GitHub root site (URL will be `https://<username>.github.io/`).
4. Keep the repository **Public**.
5. Do **not** initialize with a README (this project already has one).
6. Click **Create repository**.

### Step 2: Upload Your Project Files
Open your terminal or PowerShell inside this folder (`c:\Users\bhagw\OneDrive\Desktop\rushikesh`) and run:

```bash
# 1. Initialize git
git init

# 2. Stage all files
git add .

# 3. Commit your portfolio
git commit -m "Initial commit: Rushikesh D. Ghatul professional portfolio"

# 4. Set branch to main
git branch -M main

# 5. Link your GitHub repository (replace <username> and <repo-name> with yours)
git remote add origin https://github.com/<username>/<repo-name>.git

# 6. Push to GitHub
git push -u origin main
```

*(Alternatively, you can drag and drop all files and folders directly via GitHub's web interface using the "uploading an existing file" button).*

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** (gear icon near the top right).
3. In the left sidebar, click on **Pages**.
4. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` branch and `/ (root)` folder.
   - Click **Save**.

### Step 4: Access Your Live Website
- Wait 1 to 2 minutes for GitHub Pages to complete deployment.
- Refresh the **Pages** tab in Settings; you will see:
  > *"Your site is live at `https://<username>.github.io/<repo-name>/`"*
- Share this link on your LinkedIn profile, resume header, and job applications!

---

## 📜 How to Add & Manage Certificates

You can add **unlimited certificates** without writing any HTML.

### 1. Save your certificate file
Place your scanned certificate (either a `.pdf`, `.jpg`, `.jpeg`, `.png`, or `.webp` file) into the directory:
```text
assets/certificates/my-new-certificate.pdf
```

### 2. Add an entry to `js/certificates.js`
Open `js/certificates.js` in VS Code or any text editor and add a new object to the `certificatesData` list:

```javascript
{
  id: "solar-energy-course-2026",
  title: "Advanced Solar PV Design Certificate",
  organization: "National Institute of Solar Energy",
  date: "October 2026",
  category: "Course", // Choose from: "Internship", "Achievement", "Workshop", "Course", "Training", "Participation", "Industrial Visit", "Other"
  file: "assets/certificates/my-new-certificate.pdf",
  image: "assets/certificates/my-new-certificate-thumbnail.jpg", // Or use the PDF path directly
  description: "Hands-on design of on-grid solar photovoltaic systems and string sizing."
},
```

Save the file, commit, and push to GitHub. The certificate will **automatically appear** in the gallery with category filtering, image lightbox/PDF preview, and instant download buttons!

---

## 📄 How to Update Your Resume

1. Name your finalized resume PDF:
   ```text
   Rushikesh_D_Ghatul_Resume.pdf
   ```
2. Copy it into the `assets/` folder, replacing the placeholder:
   ```text
   assets/Rushikesh_D_Ghatul_Resume.pdf
   ```
3. Commit and push:
   ```bash
   git add assets/Rushikesh_D_Ghatul_Resume.pdf
   git commit -m "Update official resume PDF"
   git push
   ```
Both the "View Resume" and "Download Resume" buttons on the website will immediately point to your updated document.

---

## 🛠️ How to Customize Personal Details

- **Profile Picture:** Replace `assets/images/profile-rushikesh.svg` with your actual formal portrait (e.g. `assets/images/rushikesh-photo.jpg`) and update the `src` attribute on line 124 of `index.html`.
- **Social Media Links:** Search for `https://linkedin.com/in/your-profile` and `https://github.com/your-username` in `index.html` and replace them with your actual profile links.
- **Contact Details:** Update your phone number, email address, and college CGPA in `index.html` where `[ADD ...]` placeholders are indicated.
- **Projects:** Open `js/projects.js` to modify descriptions, technologies, or attach live GitHub repository URLs when they become available.

---

## 🌟 Technologies Used

- **HTML5:** Semantic architecture (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **CSS3:** Custom properties (variables), Flexbox, CSS Grid, glassmorphism, responsive media queries, and dark/light mode themes.
- **JavaScript (ES6):** Client-side dynamic rendering, filtering, scrollspy, modal viewer, and theme persistence (`localStorage`).
- **Font Awesome 6:** Engineering, utility, and social media vector icons.
- **Google Fonts:** Outfit (headings), Inter (body), and JetBrains Mono (technical badges).

---

## 📬 Contact Information

**Rushikesh D. Ghatul**  
*Electrical Engineering Student | Aspiring Electrical Engineer*  
Government College of Engineering, Yavatmal  
Maharashtra, India  
Email: [rushikesh.ghatul@example.com](mailto:rushikesh.ghatul@example.com)
