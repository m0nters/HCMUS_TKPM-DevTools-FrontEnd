# IT Tools

IT Tools is a sophisticated web platform for discovering, managing, and using a wide variety of specialized tools for IT professionals. The platform offers a plugin-based architecture where tools are dynamically loaded and presented with custom UIs, allowing users to access powerful functionality without installing separate applications. Whether you need encoding/decoding utilities, data conversion tools, or analysis instruments, IT Tools provides a centralized ecosystem for all these capabilities.

## Key Features

Xem đề bài gốc tại: https://hackmd.io/@nndkhoa9/HJjTiy7j1l

### 🔐 Advanced Authentication System

- Role-based access control (Guest, User, Premium, Admin)
- Secure JWT-based authentication with refresh token mechanism
- "Remember me" functionality for persistent sessions
- Complete user profile management with password changing capabilities

### 🧩 Dynamic Plugin Ecosystem

- Browse and discover tools organized by categories
- Mark favorites for quick access
- Premium tools for subscribed users
- Dynamic UI generation based on plugin schema definitions
- Tool search with real-time filtering and categorization

### ❤️ User Experience Features

- Favorite tools system with persistent storage
- Responsive design that works on desktop and mobile devices
- Clear visual indicators for premium content
- Loading states and error handling throughout the application

### 👑 Admin Functionality

- Comprehensive admin dashboard with statistics and system status
- Tool management (enable/disable, premium status toggling)
- Plugin upload interface for adding new tools (.dll files)
- User management system

### 🛠️ Plugin Execution

- Real-time validation of user inputs
- Results display with proper formatting
- Error handling and user feedback

## Technology Stack

### Frontend

- **React 19** with TypeScript for type-safe component development
- **Vite** for lightning-fast builds and development experience
- **TailwindCSS 4.0** for utility-first styling and responsive design
- **React Router v6** for declarative routing with nested routes
- **Context API** for global state management (Auth, Favorites)
- **Heroicons** for consistent and beautiful iconography
- **Custom hooks** for shared functionality and logic reuse

### Backend

- **.NET Core API** for RESTful services
- **Entity Framework Core** for database operations and ORM
- **JWT Authentication** with refresh token pattern
- **Plugin system** using .NET assembly loading
- **CORS** configuration for secure cross-origin requests

### Storage

- **SQL Server** for relational data storage
- **Local Storage** for client-side persistence

## Architecture Highlights

### Event Bus Pattern

The application implements a custom event bus system (`useEventBus` hook) that enables decoupled communication between components. This pattern allows for efficient state updates across the application without creating tight coupling or prop drilling.

```tsx
// Example of event bus usage
useEventBus(EVENTS.SIDEBAR_REFRESH, () => {
  fetchAllCategories();
});

// Emitting an event
eventBus.emit(EVENTS.SIDEBAR_REFRESH);
```

### Context-Based State Management

Instead of using external state management libraries, the application leverages React's Context API with custom hooks for clean and efficient state management:

- `AuthContext` + `useAuth()` - Authentication state and operations
- `FavoritesContext` + `useFavorites()` - Managing user's favorite tools

### Dynamic Plugin UI Generation

The application features a sophisticated system for dynamically generating UIs based on plugin schemas. This allows plugins to define their own interfaces without requiring frontend code changes.

```tsx
<DynamicPluginUI
  schema={pluginSchemaData}
  onSuccess={handlePluginSuccess}
  onError={handlePluginError}
/>
```

### Admin Mode Toggle Design

The admin interface features a novel "Admin Mode" toggle that transforms the regular user interface into an administrative one, allowing admins to manage plugins directly from the explorer view instead of requiring separate admin pages.

## Project Structure

```
src/
  ├── App.tsx               # Root component for setting up routing/layout
  ├── index.ts              # Barrel file for exports
  ├── main.tsx              # React entry point, renders <App /> to the DOM
  ├── vite-env.d.ts         # TypeScript environment declarations for Vite
  │
  ├── components/           # Reusable UI components
  │   ├── admin/            # Admin-specific UI components
  │   │   ├── AdminModeToggle.tsx    # Toggle for admin mode
  │   │   └── index.ts              # Barrel file
  │   │
  │   ├── auth/             # Authentication related components
  │   │   ├── LoginForm.tsx         # Login form component
  │   │   ├── RegisterForm.tsx      # Registration form component
  │   │   └── index.ts              # Barrel file
  │   │
  │   ├── common/           # Shared components
  │   │   ├── backgrounds/          # Animated background effects
  │   │   │   ├── Threads.tsx      # Thread animation component
  │   │   │   ├── Waves.tsx        # Wave animation component
  │   │   │   └── index.ts         # Barrel file
  │   │   │
  │   │   ├── textAnimation/       # Text animation components
  │   │   │   ├── FuzzyText.tsx    # Fuzzy text effect
  │   │   │   ├── SplitText.tsx    # Split text animation
  │   │   │   └── index.ts         # Barrel file
  │   │   │
  │   │   ├── ui/                  # UI primitives
  │   │   │   ├── AlertMessage.tsx # Alert/notification component
  │   │   │   ├── Button.tsx       # Button component
  │   │   │   ├── DropdownMenu.tsx # Dropdown menu component
  │   │   │   ├── FileUploadBox.tsx# File upload component
  │   │   │   ├── InfoBox.tsx      # Information display box
  │   │   │   ├── LoadingSpinner.tsx# Loading indicator
  │   │   │   ├── PluginCard.tsx   # Plugin card component
  │   │   │   └── index.ts         # Barrel file
  │   │   │
  │   │   └── index.ts             # Barrel file
  │   │
  │   ├── layout/           # Layout components
  │   │   ├── Footer.tsx           # Footer component
  │   │   ├── Header.tsx           # Header component
  │   │   ├── SidePanel.tsx        # Side navigation panel
  │   │   └── index.ts             # Barrel file
  │   │
  │   ├── plugins/          # Plugin-specific components
  │   │   ├── DynamicPluginUI.tsx  # Dynamic plugin UI renderer
  │   │   ├── InputField.tsx       # Dynamic input field
  │   │   ├── OutputField.tsx      # Dynamic output field
  │   │   ├── inputFields/         # Input field types
  │   │   ├── outputFields/        # Output field types
  │   │   └── index.ts             # Barrel file
  │   │
  │   ├── profile/          # Profile-related components
  │   │   ├── ProfileSidePanel.tsx # Profile side panel
  │   │   └── index.ts             # Barrel file
  │   │
  │   └── index.ts          # Main barrel file
  │
  ├── contexts/             # React Contexts
  │   ├── AuthContext.tsx       # Authentication context
  │   ├── FavoritesContext.tsx  # Favorites management context
  │   ├── UserContext.tsx       # User profile context
  │   └── index.ts             # Barrel file
  │
  ├── hooks/                # Custom React hooks
  │   ├── useAuth.ts            # Authentication hook
  │   ├── useDebounce.ts        # Debounce utility hook
  │   ├── useEventBus.ts        # Event bus hook
  │   ├── useFavorites.ts       # Favorites management hook
  │   ├── usePlugin.ts          # Plugin management hook
  │   └── index.ts              # Barrel file
  │
  ├── pages/                # Route-level components
  │   ├── admin/            # Admin pages
  │   │   ├── AdminDashboard.tsx    # Admin dashboard
  │   │   ├── AdminOverview.tsx     # System overview
  │   │   ├── ToolUpload.tsx        # Plugin upload interface
  │   │   ├── UserManagement.tsx    # User management
  │   │   └── index.ts              # Barrel file
  │   │
  │   ├── profile/          # Profile pages
  │   │   ├── MyProfile.tsx          # Profile main page
  │   │   ├── FavoritesSection.tsx   # Favorites management
  │   │   ├── ProfileInfoSection.tsx # Profile information
  │   │   ├── SecuritySection.tsx    # Security settings
  │   │   └── index.ts               # Barrel file
  │   │
  │   ├── 401.tsx           # Unauthorized page
  │   ├── 404.tsx           # Not found page
  │   ├── Home.tsx          # Landing page
  │   ├── Login.tsx         # Login page
  │   ├── PluginDetails.tsx # Plugin details page
  │   ├── PluginExplorer.tsx# Plugin explorer page
  │   ├── Premium.tsx       # Premium features page
  │   ├── Register.tsx      # Registration page
  │   ├── TermsOfService.tsx# Terms of service page
  │   └── index.ts          # Barrel file
  │
  ├── routes/               # Route configuration
  │   ├── protected/            # Protected routes
  │   │   ├── ProtectedRoutes.tsx  # Protected route wrapper
  │   │   └── index.ts            # Barrel file
  │   │
  │   ├── public/               # Public routes
  │   │   ├── PublicRoutes.tsx    # Public route wrapper
  │   │   └── index.ts            # Barrel file
  │   │
  │   ├── unauthenticated/      # Unauthenticated routes
  │   │   ├── UnauthenticatedRoutes.tsx  # Unauthenticated route wrapper
  │   │   └── index.ts                  # Barrel file
  │   │
  │   ├── AppRoutes.tsx         # Main routes configuration
  │   └── index.ts              # Barrel file
  │
  ├── services/             # API services
  │   ├── api/                  # API configuration
  │   │   ├── axios.ts          # Axios instance setup
  │   │   └── index.ts          # Barrel file
  │   │
  │   ├── admin/                # Admin services
  │   │   ├── pluginService.ts  # Plugin management
  │   │   ├── userService.ts    # User management
  │   │   └── index.ts          # Barrel file
  │   │
  │   ├── plugins/              # Plugin services
  │   │   ├── pluginService.ts  # Plugin operations
  │   │   └── index.ts          # Barrel file
  │   │
  │   ├── user/                 # User services
  │   │   ├── userService.ts    # User operations
  │   │   └── index.ts          # Barrel file
  │   │
  │   ├── authService.ts        # Authentication service
  │   ├── eventBus.ts           # Event bus service
  │   └── index.ts              # Barrel file
  │
  ├── types/                # TypeScript types
  │   ├── auth.ts               # Authentication types
  │   ├── authContext.ts        # Auth context types
  │   ├── dropdownMenu.ts       # Dropdown menu types
  │   ├── plugins.ts            # Plugin types
  │   ├── pluginSchema.ts       # Plugin schema types
  │   ├── user.ts               # User types
  │   └── index.ts              # Barrel file
  │
  └── utils/                # Utility functions
      ├── files.ts              # File utilities
      ├── string.ts             # String utilities
      └── index.ts              # Barrel file
```

## Installation and Setup

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- .NET 6.0 or higher (for backend)

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/m0nters/DevTools-FrontEnd.git
cd DevTools-FrontEnd

# Install dependencies
npm install --legacy-peer-deps

# Start frontend website server
npm run dev
```

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/khanhst0209/DevTools.git
cd DevTools

# Clean up old database (if have)
dotnet ef database drop --force
dotnet ef database update

# Start backend server
dotnet run
```

## Configuration

The application can be configured by editing the environment variables in a `.env` file:

```env
# API Configuration
VITE_API_URL=http://localhost:5175/api/v1

# Authentication
VITE_AUTH_TOKEN_KEY=auth_token
VITE_REFRESH_TOKEN_KEY=refresh_token

# Other Configuration
VITE_APP_NAME=IT Tools
VITE_APP_VERSION=1.0.0
```

## Development Workflow

### Adding a New Component

1. Create component in appropriate directory under `components` folder
2. Export from index.ts file in the directory
3. Import and use in pages or other components

### Adding a New Page

1. Create page component in `pages` folder
2. Add route in appropriate router file under routes

### Adding a New API Service

1. Create service file in `services` folder
2. Use `withAuth` or `apiRequest` utility for API calls
3. Export from `index.ts` file in the directory

## Deployment

The application is built as a single-page application that can be deployed to any static hosting service:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Future Improvements

- Enhanced analytics dashboard for admins
- Subscription payment integration

## License

MIT License

---

Built by Trịnh Anh Tài (FE, BE) & Phạm Nguyên Khánh (BE)
