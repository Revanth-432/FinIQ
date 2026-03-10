# 🪙 FinIQ - The Gamified Financial Survival Guide

![FinIQ Banner](https://via.placeholder.com/1200x400?text=FinIQ:+Master+Your+First+Salary)

> **Catching them at Day Zero.**  
> FinIQ is a gamified, interactive financial education platform designed specifically for **18–24 year-old B.Tech students and freshers**. We help young professionals **master their money, decode their CTC, and avoid debt traps the exact moment they receive their first job offer.**

*"Anyone can build a library of financial articles. We built a behavioral engine. By utilizing React Native, Supabase, and hardware-level haptics, we completely replaced boring text with a dopamine-driven learning loop that teaches financial survival through gameplay."*

---

# 💡 The Genesis: Innovation Internship

FinIQ was conceptualized and engineered as part of our **Innovation Internship**.

### Why this project?

We noticed a massive gap between **graduation and the professional world**.

Millions of freshers land **₹12 LPA offers but face "CTC Shock"** when their first paycheck arrives depleted by hidden taxes and deductions.

At the same time, **predatory 1-click credit and BNPL apps** are trapping Gen Z in debt.

Traditional financial literacy tools are **boring and feel like homework.**

### How we solved it

We pivoted from building a **passive "information library"** to an **active "behavioral engine."**

Our goal during this internship was to build a **minimum viable product (MVP)** that actually forces user engagement through:

- Gamification  
- Immediate sensory feedback  
- Real-time analytics  

---

# 👥 The Team

This project was collaboratively built by:

- **A Revanth**
- **M Sri Varsha**
- **Sk Nayaz Ahmed**

---

# ✨ Core Features

## 🧠 7-Step Behavioral Loop

- **Chat Reveals**  
  Conversational UI for bite-sized, digestible learning.

- **Interactive Quizzes**  
  Active recall testing for concepts like **CTC, taxes, and EMIs.**

- **Tinder-Style Swipe Games**  
  Swipe left/right to categorize **expenses, assets, and tax deductions.**

---

## ⚡ Hardware-Level Sensory Engine

Custom **audio and native haptics** engineered to override **iOS/Android silent modes**, providing immediate physical feedback for right/wrong answers.

---

## 📊 Live Telemetry & Analytics

Fully integrated **PostHog product analytics** routed natively through **Expo** to track:

- Exact user drop-offs
- Session durations
- User engagement metrics in real time

---

## 🗣️ User-Driven Content Pipeline

A native **slide-up feedback system** allowing users to request new learning modules.

Requests are written directly to the **Supabase database**, enabling **community-driven feature development.**

---

## 💎 Built-In Monetization (Pro Paywall)

A **high-converting dark-mode premium subscription model** offering advanced investing modules and financial tools.

---



---

# 🛠️ Tech Stack

### Frontend
- React Native  
- Expo  
- Expo Router  

### Backend & Database
- Supabase (PostgreSQL, Row Level Security)

### Authentication
- Supabase Auth (JWT)
- `@react-native-async-storage/async-storage` (Persistent Sessions)

### Analytics
- PostHog (`posthog-react-native`)

### Native Modules
- `expo-av` (Audio)  
- `expo-haptics` (Vibration)

---

# 🚀 Local Development Setup

To run the app locally:

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/FinIQ.git
cd FinIQ
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

---

## 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory.

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_POSTHOG_API_KEY=your_posthog_api_key
```

---

## 4️⃣ Start the Expo Server

```bash
npx expo start -c
```

---

# 🗺️ Roadmap

- [x] Gamified Learning Engine (Swipe Games, Quizzes)
- [x] Persistent Authentication
- [x] Product Analytics Integration
- [ ] Connect RevenueCat for iOS/Android Subscriptions
- [ ] Global Leaderboards & Daily Streaks
- [ ] Advanced Financial Calculators (SIP, EMI, Tax Slabs)

---

# ❤️ Built By

Built with ❤️ for financial literacy by:

**Revanth • Sri Varsha • Nayaz**
