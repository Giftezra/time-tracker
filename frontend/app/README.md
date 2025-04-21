# Time Tracker Frontend Application

This is a React Native application built with Expo Router that provides time
tracking functionality. The application is structured using a modular
architecture for better maintainability and scalability.

## Directory Structure

```
frontend/app/
├── animation/       # Animation-related components and utilities
├── component/       # Reusable UI components
├── context/        # React Context providers and state management
├── management/     # Management-related features and components
├── services/       # API services and external integrations
├── staff/          # Staff-related features and components
├── types/          # TypeScript type definitions
├── utils/          # Utility functions and helpers
├── _layout.tsx     # Root layout component with navigation setup
├── index.tsx       # Main entry point of the application
└── authentication.tsx # Authentication-related functionality
```

## Key Components

### Root Layout (`_layout.tsx`)

The root layout component sets up the basic structure of the application with:

- Safe area handling for different devices
- Keyboard avoiding behavior
- Stack navigation setup
- Various providers for app-wide functionality:
  - Location services
  - Notifications
  - Authentication

### Main Entry (`index.tsx`)

The main entry point of the application that:

- Implements theme support
- Renders the onboarding component
- Handles the primary layout structure

### Features

1. **Authentication**

   - User authentication and authorization
   - Session management

2. **Management**

   - Calendar and scheduling
   - Time tracking
   - Staff management

3. **Components**

   - Reusable UI components
   - Helper components
   - Form elements

4. **Context**
   - State management
   - Global app settings
   - Theme management

## Technology Stack

- React Native
- Expo Router
- TypeScript
- React Context for state management

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npx expo start
   ```

## Development Guidelines

1. **Component Structure**

   - Keep components focused and single-responsibility
   - Use TypeScript for type safety
   - Implement proper error handling

2. **State Management**

   - Use React Context for global state
   - Keep state close to where it's used
   - Implement proper data flow patterns

3. **Styling**

   - Use StyleSheet for better performance
   - Follow the established theme system
   - Maintain consistency in styling patterns

4. **Navigation**
   - Use Expo Router for navigation
   - Implement proper route protection
   - Handle deep linking appropriately
