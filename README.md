# Caktus Coco Wellness App

## Project Description

This project is a wellness application that includes various features such as:

- Daily practices
- Wellness exercises
- Therapist listings
- Community features
- Personal tracking

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

This will start the server at `http://localhost:3000`

### Build

To build the project for production:

```bash
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── assets/           # Static assets (images, icons)
├── components/       # Reusable components
│   ├── common/       # Shared UI components
│   ├── fitness/      # Fitness-related components
│   └── wellbeing/    # Wellbeing-related components
├── context/          # React context providers
├── hooks/            # Custom hooks
├── pages/            # Page components
│   ├── Practices.tsx # Wellness practices page
│   └── ...
├── styles/           # CSS modules and global styles
│   ├── FilterChipsSystem.css
│   ├── TherapistCardsSystem.css
│   └── ...
├── utils/            # Utility functions and types
│   ├── ErrorHandling.ts
│   ├── TypeUtilities.ts
│   └── ...
└── index.tsx         # App entry point
```

## Documentation

- [CSS-MANIFEST.md](./CSS-MANIFEST.md) - Documentation of CSS structure
- [REFACTORING-SUMMARY.md](./REFACTORING-SUMMARY.md) - Summary of recent refactoring work
- [API-IMPLEMENTATION-GUIDE.md](./API-IMPLEMENTATION-GUIDE.md) - API integration guide

## Technical Debt Reduction

We are actively working on reducing technical debt. Our current focus areas:

1. Component extraction and reusability
2. CSS consolidation and organization
3. Type safety improvements
4. Consistent error handling
5. Comprehensive documentation

For more details, see [REFACTORING-SUMMARY.md](./REFACTORING-SUMMARY.md).
