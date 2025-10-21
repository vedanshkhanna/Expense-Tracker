# 🔐 Security & Sync Guide

This document outlines the authentication, offline support, and data protection strategies for the solo expense tracker app.

---

## 🔑 Authentication & Access Control

### Login Options

- PIN-based login (4–6 digit code)
- OTP verification via email or SMS
- Optional biometric login (fingerprint or face unlock)

### Logic

- On first launch:
  - Prompt user to set a PIN
  - Optionally enable biometric login
- On future launches:
  - Require PIN or biometric
  - OTP fallback if PIN is forgotten

---

## ☁️ Cloud Sync

### Backend Options

- Firebase Firestore (recommended)
- Supabase or local JSON fallback

### Sync Logic

- All entries stored locally first
- Sync to cloud when internet is available
- Conflict resolution:
  - Prefer latest timestamp
  - Notify user if manual merge is needed

---

## 📴 Offline Mode

### Behavior

- App works fully offline:
  - Add/view/edit entries
  - Access dashboard and insights
- Sync resumes automatically when online

### Storage

- Use local storage or SQLite
- Queue unsynced changes for background sync

---

## 🔐 Data Protection

### Strategies

- Encrypt sensitive data (PIN, entries) locally
- Use HTTPS for all cloud communication
- Firebase rules to restrict access per user
- Optional backup/export to encrypted file

---

## 🛡️ User Permissions

- Receipt scanner: request camera access
- Voice commands: request microphone access
- Export: request file system access (if needed)

---

## 🧠 Recovery & Reset

- Forgot PIN:
  - Trigger OTP verification
  - Allow PIN reset after success
- Full reset:
  - Wipe local data
  - Re-authenticate before syncing cloud data

---
