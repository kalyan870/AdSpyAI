# AdSpy AI — Mobile Application (Android / iOS)

> **Companion Native Mobile Application for AdSpy AI**  
> Built with React Native 0.88, Expo SDK 58, React 19, and TypeScript. Native-device behavior still needs an Android/iOS runtime check.

---

## 📱 Screens & Architecture

1. **Home Screen (`HomeScreen.tsx`)**:
   - Hero banner with quick analyze entrypoint
   - Product capability cards (Hook score, Script breakdown, UGC rewrite)
   - Feature spotlight chips
   - Recent analyses feed with direct tap navigation

2. **Analyze Screen (`AnalyzeScreen.tsx`)**:
   - URL input with clipboard paste button
   - Multi-step animated progress simulation
   - Animated SVG circular hook score ring
   - 4-tab breakdown:
     - 🎣 **Hook**: Score, psychological trigger, opening hook quote, audience, and pacing.
     - 📋 **Script**: Sectional color-coded breakdown (`HOOK`, `PROBLEM`, `SOLUTION`, `CTA`).
     - 🎬 **Sora**: 5 Sora 2 prompts with one-tap copy and haptic feedback.
     - ✅ **UGC**: Rebuilt script copy with direct Android native Share & Clipboard support.

3. **History Screen (`HistoryScreen.tsx`)**:
   - Persistent AsyncStorage history
   - Search filter by URL or hook style
   - Swipe/tap delete and Clear All options

4. **Settings Screen (`SettingsScreen.tsx`)**:
   - Optional OpenAI API Key configuration with visibility toggle
   - Optional Website Backend URL connection
   - Demo mode & history persistence preferences
   - Direct documentation and privacy links

---

## ⚙️ Prerequisites

- **Node.js**: v18 or later
- **Expo Go App**: Install from Google Play Store on your Android device (or run an Android Emulator via Android Studio).

---

## 🚀 Running the App

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Start Expo Development Server
```bash
npx expo start
```

### 3. Run on Android
- **Physical Device**: Scan the QR code shown in your terminal using the Expo Go app.
- **Android Emulator**: Press `a` in the terminal to launch directly on an active Android Virtual Device (AVD).

```bash
npx expo start --android
```

---

## 📦 Building Standalone Android APK

To generate a production-ready standalone `.apk` or `.aab` file for Google Play:

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Log In to Expo
```bash
eas login
```

### 3. Configure EAS Build
```bash
eas build:configure
```

### 4. Build Standalone APK
```bash
eas build -p android --profile preview
```
This produces an installable Android `.apk` file that can be side-loaded onto any Android phone or tablet without Expo Go!
