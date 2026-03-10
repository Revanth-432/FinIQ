# 🪙 FinIQ - The Gamified Financial Survival Guide

![FinIQ Banner Placeholder](https://via.placeholder.com/1200x400?text=FinIQ+Financial+Survival+Engine)

> **Catching them at Day Zero.** > FinIQ is a gamified, interactive financial education platform designed specifically for 18-24 year-old B.Tech students and freshers. We help young professionals master their money, decode their CTC, and avoid debt traps the exact moment they receive their first job offer.

*"Anyone can build a library of financial articles. We built a behavioral engine. By utilizing React Native, Supabase, and hardware-level haptics, we completely replaced boring text with a dopamine-driven learning loop that teaches financial survival through gameplay."* ---

## ✨ Core Features

* **🧠 7-Step Behavioral Loop:** * **Chat Reveals:** Conversational UI for bite-sized, digestible learning.
  * **Interactive Quizzes:** Active recall testing for concepts like CTC and EMIs.
  * **Tinder-Style Swipe Games:** Swipe left/right to physically categorize expenses, assets, and tax deductions.
* **⚡ Hardware-Level Sensory Engine:** * Custom audio and native haptics engineered to override iOS/Android silent modes, providing immediate, physical feedback on right/wrong answers.
* **📊 Live Telemetry & Analytics:** * Fully integrated **PostHog** product analytics routing natively through Expo to track exact user drop-offs and session durations in real-time.
* **🗣️ User-Driven Content Pipeline:** * A native, slide-up feedback loop allowing users to dictate the roadmap by writing module requests directly to our Supabase database.
* **💎 Built-In Monetization (Pro Paywall):** * A high-converting, dark-mode premium subscription model offering advanced investing modules for users transitioning from their first salary to their first appraisals.

## 🛠️ Tech Stack

* **Frontend:** React Native, Expo, Expo Router
* **Backend & Database:** Supabase (PostgreSQL, Row Level Security)
* **Authentication:** Supabase Auth (JWT) & `AsyncStorage` (Persistent Sessions)
* **Analytics:** PostHog
* **Native Modules:** `expo-av` (Audio), `expo-haptics` (Vibration)

## 📸 Screenshots

| The Learning Journey | Interactive Swipe Game | Pro Subscription Paywall |
|:---:|:---:|:---:|
| ![Journey](https://via.placeholder.com/250x500?text=Gamified+Roadmap) | ![Swipe Game](https://via.placeholder.com/250x500?text=Tinder-Style+Swipe+Game) | ![Paywall](https://via.placeholder.com/250x500?text=Dark+Mode+Paywall) |

## 🚀 Local Development Setup

**1. Clone the repository**
```bash
git clone [https://github.com/yourusername/FinIQ.git](https://github.com/yourusername/FinIQ.git)
cd FinIQ
