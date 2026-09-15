# AI Course CMS - WordPress Plugin & Code Snippet

A lightweight, robust WordPress plugin and code snippet built specifically for managing the **AI Course & Workshop** content.

---

## Features

- **Custom Post Types (CPTs)**:
  - 🤖 **AI Tools (`ai_tool`)**: Manage 10–12 core AI tools (ChatGPT, Gemini, Claude, Canva AI, Gamma, NotebookLM, ElevenLabs, etc.) with badges, categories, and direct links.
  - 🏛️ **5 Pillars (`ai_pillar`)**: Configure the 5 fundamental workshop pillars (Understand, Communicate, Work, Create, Automate) with step-by-step milestones.
  - 🎯 **Real-Life Challenges (`ai_challenge`)**: Add and edit role-specific project tracks (Teacher, Shopkeeper, Homemaker, Working Professional, Content Creator, etc.) with workflow pipelines and copy-ready AI prompts.
  - 📅 **Batches (`ai_batch`)**: Schedule live Sunday offline & Zoom batches with automatic seat counters (`seatsTotal`, `seatsBooked`, status).
  - 📥 **Inquiries (`ai_inquiry`)**: Collect and view workshop registrations with direct WhatsApp notification links.
- **REST API Endpoints**:
  - `GET /wp-json/pooja/v1/ai-course`: Complete course data package for the Next.js frontend.
  - `POST /wp-json/pooja/v1/ai-inquiry`: Endpoint to submit workshop registrations directly from the site.
- **1-Click Default Content Setup**:
  - Automatically seeds all 12 core tools, 5 pillars, and 8 real-life challenges with bilingual Marathi & Hindi content in one click.

---

## Method 1: Using the WPCode / Code Snippets Plugin (Easiest)

1. Go to your **WordPress Admin Dashboard**.
2. Navigate to **Code Snippets** → **Add New** (or **WPCode** → **Add Snippet**).
3. Choose **Add Your Custom Code (New Snippet)**.
4. Set the **Code Type** to **PHP Snippet**.
5. Open `/wordpress/ai-course-cms.php` from this project, copy its entire contents, and paste it into the code box.
6. Set the **Insertion Method** to **Run Everywhere**.
7. Toggle the snippet status to **Active** and click **Save Snippet**.
8. You will immediately see the **AI Course CMS** menu in your WordPress sidebar!

---

## Method 2: Installing as a Standalone WordPress Plugin

1. Create a folder named `ai-course-cms` on your computer.
2. Place the `ai-course-cms.php` file inside that folder.
3. Compress the folder into a `.zip` file (`ai-course-cms.zip`).
4. In WordPress Admin, navigate to **Plugins** → **Add New** → **Upload Plugin**.
5. Choose `ai-course-cms.zip` and click **Install Now**.
6. Click **Activate Plugin**.

---

## Method 3: Direct FTP / File Manager Upload

1. Access your WordPress server via cPanel File Manager or FTP.
2. Navigate to `wp-content/plugins/`.
3. Create a directory named `ai-course-cms/`.
4. Upload `ai-course-cms.php` into `wp-content/plugins/ai-course-cms/`.
5. Go to **Plugins** in your WordPress dashboard and click **Activate**.

---

## First-Time Setup & Seeding

1. Once activated, click **AI Course CMS** in the left WordPress menu.
2. Go to **Settings** (or the main AI Course CMS page).
3. Click the **"1-Click Default Content Setup"** button.
4. All 12 tools, 5 pillars, and 8 real-life challenges will be populated immediately with full Marathi and Hindi translations.

---

## REST API Integration

The Next.js frontend automatically synchronizes with the WordPress REST API:
- Endpoint: `https://your-wordpress-site.com/wp-json/pooja/v1/ai-course`
- In your website's **Admin Panel** under **AI Course Tab**, you can also edit, preview, and save tools and batches directly in real time.
