# Supabase Setup Guide - Kerala Science City HRMS

This guide will walk you through setting up your Supabase database in less than 5 minutes. You do **not** need any prior database experience.

---

## Step 1: Create a New Supabase Project

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and sign in.
2. Click the **New Project** button.
3. Select your organization.
4. Fill in the project details:
   - **Name**: `KSC HRMS`
   - **Database Password**: *Choose a secure password and write it down!*
   - **Region**: Select a region close to Kerala, e.g., `Mumbai (ap-south-1)` or `Singapore`.
5. Click **Create new project** and wait a couple of minutes for the database to provision.

---

## Step 2: Execute the Setup Script

Once your project is ready, you will run the complete database creation script we provided:

1. In the left navigation menu of your Supabase dashboard, click on the **SQL Editor** icon (it looks like a sheet of paper with `SQL` on it, or a terminal icon).
2. Click **New Query** (or the `+` button) to open a fresh SQL editor tab.
3. Open the file [supabase_setup.sql](file:///c:/Users/Acer/Documents/AntiGravity/KSC_HRM/supabase_setup.sql) that we generated in your project.
4. **Copy the entire content** of `supabase_setup.sql` and **paste it** into the Supabase SQL Editor text area.
5. Click the green **Run** button (or press `Ctrl + Enter` / `Cmd + Enter`).
6. You should see a success message: `Success. No rows returned` or similar.

Your tables, Row-Level Security policies, logging triggers, and system credentials have now been fully set up!

---

## Step 3: Extract API Keys for the React Application

To connect your React frontend to your Supabase backend, you need two pieces of information:

1. Click on the **Project Settings** gear icon in the bottom left corner of the Supabase dashboard.
2. In the Settings sidebar, click on **API**.
3. Under the **Project API keys** section, copy the following values:
   - **Project URL**: (e.g., `https://xyzabc.supabase.co`) -> This is your `SUPABASE_URL`.
   - **anon / public key**: (A long string starting with `eyJhbGci...`) -> This is your `SUPABASE_ANON_KEY`.
4. Create a file named `.env` in the root of your project directory (`c:\Users\Acer\Documents\AntiGravity\KSC_HRM`) and add these keys like this:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
```

---

## Step 4: Accessing the System for the First Time

Once you run the React application (instructions will follow in the main README), you can log in using the pre-seeded **Root Admin** credentials:

- **Username**: `root_admin`  *(or employee number: `KSC001`)*
- **Password**: `KSCAdminPassword123!`

> [!WARNING]
> **Security Recommendation**: On your first successful login, navigate to your Profile and click **Change Password** to set a secure password of your choice.
