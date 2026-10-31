# 🐾 Wagora

> *"Technology is silent. Love is louder."*

**Wagora** is a premium, modern pet-care ecosystem and social network built for pet owners, pet lovers, and service providers. Designed with a clean, high-polish aesthetic ("Airbnb meets Apple Health"), Wagora pairs thoughtful mobile UX with powerful features for pet parenting.

---

## ✨ Features

### 1. 👥 Community Feed & Stories
* **Story Avatars Tray:** Tap through community pet stories and your own pet's moments.
* **Category Filters:** Filter posts dynamically by *Following*, *Trending*, *Adoption Needs*, *Training Tips*, and *Near Me*.
* **Interactive Posts:** High-resolution pet photography, bouncy reaction animations, comment sections, and adoption listing tags.

### 2. 📝 Content Creation & Adoption Portal
* **Create Post Modal:** Clean, focused creation flow with camera / photo picker (`expo-image-picker`).
* **Adoption Listings:** Specialized toggle switch to publish shelter listings with breed, age, and health metadata.
* **Tagging & Visibility:** Multi-pet tagging and privacy controls (*Everyone*, *Followers*, *Private*).

### 3. 🐕 Pet Mate (Discovery & Matching)
* **Match Cards:** Swipeable / interactive deck showcasing local pets with breed details, temperament tags, and compatibility score.
* **Actions:** Pass, Super Like, and Heart Match with haptic feedback.

### 4. 🛍️ E-Commerce Shop & Pet Boarding Services
* **Segmented Hub:** Instant animated switching between **"Essentials"** (Products) and **"Boarding"** (Services).
* **Pet Essentials Store:**
  * Categorized browsing (*Food, Toys, Grooming, Accessories, Health, Beds*).
  * 2-column product grid with discount pills, INR pricing (`₹`), wishlist toggles, and animated quantity stepper (`-`, `qty`, `+`).
  * Floating cart button with live badge counter.
* **Verified Boarding Discovery:**
  * Luxury facility cards with slot availability alerts (e.g. *3 slots left*).
  * Amenity chips (*Pool, 24/7 Vet On-Site, Organic Meals, Webcam Access*).
  * Direct actions: *Call*, *Directions*, and *Check Availability*.

### 5. 📊 Health & Profile Dashboard
* **Pet Health Index:** Live health gauge (`92% Excellent`) and vet checkup tracking.
* **Preventative Timeline:** Upcoming vaccine reminders and weight monitoring.
* **Multi-Role Profile:** Settings for pet parents, sitters, and shelter partners.

---

## 🛠️ Tech Stack

* **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 58)
* **Router:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
* **Icons:** [@expo/vector-icons](https://icons.expo.fyi/) (`Ionicons`, `MaterialCommunityIcons`)
* **Graphics & Effects:** `expo-linear-gradient`, `expo-haptics`, `expo-image-picker`, `expo-blur`
* **Language:** TypeScript 5.8+ (Strict Typechecking)

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or newer)
* [Expo Go](https://expo.dev/go) app on iOS or Android (optional for physical device testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/cyrus296/Wagora.git
cd Wagora

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

### Key Commands

```bash
npx expo start          # Run Metro bundler (press 'w' for web, scan QR for mobile)
npx tsc --noEmit        # Run TypeScript typechecker
npx expo-doctor         # Diagnose dependency and project configuration
```

---

## 📱 Navigation Structure

```
app/
├── _layout.tsx           # Root navigation stack with Modal configs
├── +not-found.tsx        # 404 handler
├── create.tsx            # Create Post & Adoption listing modal
└── (tabs)/
    ├── _layout.tsx       # Bottom tab bar navigator
    ├── index.tsx         # Community Feed & Stories
    ├── discover.tsx      # Pet Mate Discovery Deck
    ├── shop.tsx          # Shop & Boarding Hub
    └── profile.tsx       # Pet Profile & Health Dashboard
```

---

## 📄 License

MIT © [Nilesh Maurya](https://github.com/cyrus296)
