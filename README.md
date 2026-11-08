# SouLink 🌿

**SouLink** is a modern mental wellness, personal reflection, and community mobile application built with **React Native** and **Expo**. It provides individuals with a safe, reflective space to track their feelings, write diaries, manage tasks, and access wellness guides and community resources.

---

## ✨ Features

- **🌸 MySpace (Personal Wellness Space)**:
  - **My Diary**: Safe and private personal journaling with custom entry titles, editing, persistent storage, and renameable diary headers.
  - **Quick Notes, Calendar, To-dos & Memories**: Dedicated wellbeing tools designed for daily habit tracking and personal growth.
- **🌐 Multilingual Support**:
  - Integrated localization powered by `i18next` and `react-i18next`.
  - Supports multiple languages with user preference saved persistently via `AsyncStorage`.
- **🤝 Community & Guides**:
  - Curated wellbeing guides and mindfulness content.
  - Community tab to connect, share, and find support.
- **👤 Profile & Personal Info Management**:
  - Personalized settings, profile customisation, and easy privacy controls.
- **📱 Cross-Platform**:
  - Runs seamlessly on **Android**, **iOS**, and **Web**.

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.88) with [Expo](https://expo.dev/) (SDK 58)
- **Navigation**: React Navigation (Native Stack & Bottom Tabs v7)
- **State & Storage**: React Hooks & `@react-native-async-storage/async-storage`
- **Internationalization**: `i18next` & `react-i18next`
- **Typography & Icons**: `@expo/vector-icons` (Ionicons), `@expo-google-fonts/cormorant-garamond`, `@expo-google-fonts/inter`
- **Web Support**: `react-native-web`

---

## 📁 Project Structure

```text
SouLink/
├── .gitignore
├── README.md
└── frontend/
    ├── assets/                    # App icons, splash screens, and images
    ├── screens/
    │   ├── SplashScreen.js        # Animated entry screen
    │   ├── HomeScreen.js          # Main dashboard & daily check-in
    │   ├── LanguageScreen.js      # Language selector
    │   ├── SettingsScreen.js      # App preferences
    │   ├── PersonalInfoScreen.js  # User profile view
    │   ├── EditPersonalInfoScreen.js
    │   └── tabs/
    │       ├── CommunityScreen.js # Community discussions
    │       ├── GuidesScreen.js    # Curated wellness guides
    │       ├── ProfileScreen.js   # User profile tab
    │       └── WellnessScreen/    # MySpace & wellbeing features
    │           ├── index.js
    │           └── components/
    │               └── MySpace.js
    ├── App.js                     # Root navigation & app initialization
    ├── ExplorerTabs.js            # Bottom navigation configuration
    ├── i18n.js                    # Localization setup & translations
    ├── app.json                   # Expo configuration
    └── package.json               # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Expo Go](https://expo.dev/go) app on your mobile device (Android / iOS)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AKASH02-byte/SouLink.git
   cd SouLink/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the Expo development server:
```bash
npm start
```

From the terminal:
- Press **`w`** to open in your web browser.
- Press **`a`** to open on an Android emulator or connected device.
- Press **`i`** to open on an iOS simulator.
- Scan the printed QR code with **Expo Go** (Android) or the **Camera app** (iOS) to run on your physical phone.

---

## 📄 License

This project is licensed under the terms specified in the [`frontend/LICENSE`](frontend/LICENSE) file.
