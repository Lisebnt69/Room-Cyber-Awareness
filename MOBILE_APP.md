# ROOMCA Mobile App - React Native

## Setup

```bash
npx react-native init ROOMCAMobile
cd ROOMCAMobile
npm install
```

## Architecture

```
ROOMCAMobile/
├── src/
│   ├── screens/
│   │   ├── AuthStack/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── BiometricAuthScreen.tsx
│   │   ├── AppStack/
│   │   │   ├── ScenarioScreen.tsx
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   ├── services/
│   │   ├── api.ts (API calls)
│   │   ├── auth.ts (Biometric, OAuth)
│   │   ├── offline.ts (Sync & cache)
│   │   ├── notifications.ts (Push)
│   ├── components/
│   │   ├── ScenarioCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Toast.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ScenarioContext.tsx
│   ├── App.tsx
│   ├── Navigation.tsx
```

## Key Features

### 1. Authentication
- **Biometric Auth**: Face ID / Fingerprint
- **OAuth**: Sign in with Microsoft/Google
- **Offline**: Cache user session

### 2. Scenarios
- **Offline Mode**: Download scenarios for offline play
- **Push Notifications**: Real-time campaign alerts
- **Background Sync**: Sync results when online

### 3. Dashboard
- **Real-time Progress**: Live score updates
- **Leaderboard**: See rankings
- **Achievements**: Badge display

### 4. Performance
- **Code Splitting**: Lazy load screens
- **Image Optimization**: Compress assets
- **Database**: SQLite for offline storage

## Dependencies

```json
{
  "@react-navigation/native": "^6.0.0",
  "@react-navigation/bottom-tabs": "^6.0.0",
  "react-native-gesture-handler": "^2.0.0",
  "react-native-biometrics": "^3.0.0",
  "realm": "^12.0.0",
  "expo-notifications": "^0.20.0",
  "axios": "^1.4.0"
}
```

## API Integration

```typescript
// services/api.ts
const api = axios.create({
  baseURL: 'https://api.roomca.io',
  timeout: 10000
})

export const login = (email: string, password: string) => api.post('/auth/login', { email, password })
export const getScenarios = () => api.get('/scenarios')
export const submitResult = (result: any) => api.post('/results', result)
```

## Offline Support

```typescript
// services/offline.ts
import Realm from 'realm'

const UserSchema = {
  name: 'User',
  properties: {
    id: 'int',
    email: 'string',
    name: 'string'
  }
}

const realm = new Realm({ schema: [UserSchema] })
```

## Push Notifications

```typescript
// services/notifications.ts
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

export const registerForNotifications = async () => {
  const token = (await Notifications.getExpoPushTokenAsync()).data
  await axios.post('/device/register', { token })
}
```

## Build & Deploy

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android

# Production build
eas build --platform all
eas submit --platform all
```

## Roadmap

- [ ] Full offline mode (100% playable without internet)
- [ ] Custom notifications based on user preferences
- [ ] AR/VR phishing scenarios
- [ ] Voice authentication
- [ ] Multi-language support
- [ ] Accessibility features (WCAG)
