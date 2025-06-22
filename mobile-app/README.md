# Caktus Coco Mobile App

This is a mobile application for Caktus Coco, offering the same features and UI as the web platform, but optimized for mobile devices.

## Features

- User authentication (login/register)
- Daily practices tracking
- Wellbeing tips
- Session booking with practitioners
- Community groups
- Profile management

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or Yarn
- Expo CLI

### Installation

1. Navigate to the mobile app directory:
```bash
cd mobile-app
```

2. Install dependencies:
```bash
npm install
```

or with Yarn:
```bash
yarn
```

3. Create the necessary assets directory structure:
```bash
mkdir -p assets/fonts
```

4. Download the required fonts:
```bash
# These commands are placeholders - you'll need to actually download these fonts
curl -o assets/fonts/Righteous-Regular.ttf https://path-to-your-font/Righteous-Regular.ttf
curl -o assets/fonts/HappyMonkey-Regular.ttf https://path-to-your-font/HappyMonkey-Regular.ttf
curl -o assets/fonts/LuckiestGuy-Regular.ttf https://path-to-your-font/LuckiestGuy-Regular.ttf
```

Alternatively, copy these fonts from your web assets.

5. Create a placeholder image for practitioner images:
```bash
mkdir -p assets/images
touch assets/practitioner-placeholder.png
touch assets/logo.png
```
Replace these with your actual logo and placeholder images.

### Running the App

1. Start the Expo development server:
```bash
npm start
```

or with Yarn:
```bash
yarn start
```

2. Use the Expo Go app on your device to scan the QR code, or press:
   - `i` to open in iOS simulator
   - `a` to open in Android emulator

## Database Connection

The app uses Supabase, with the same configuration as your web application. The connection details are stored in `app.json`.

## Project Structure

- `/assets` - Contains images, fonts, and other static assets
- `/components` - Reusable UI components
- `/screens` - Main app screens
- `/contexts` - React Context API providers (auth, practices, etc.)
- `/services` - API and database services
- `/styles` - Global styles and theme definitions

## Building for Production

To create a production build:

```bash
expo build:android
expo build:ios
```

Follow the Expo documentation for publishing to app stores.

## Troubleshooting

If you encounter any issues:

1. Make sure Supabase credentials are correct in `app.json`
2. Check that all required fonts are in the assets/fonts directory
3. Ensure you have the latest version of Expo CLI installed
4. Clear the Expo cache with `expo start -c`

## License

This project is licensed under the same terms as the web application.
