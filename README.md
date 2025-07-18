# I-Gebeya Admin - Next.js Telegram Mini App

A modern admin panel built with Next.js, TypeScript, and TailwindCSS for the I-Gebeya Telegram mini app.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14, TypeScript, TailwindCSS
- **Telegram Integration**: Full Telegram WebApp support
- **Authentication**: Secure admin login with 2FA
- **User Management**: View, manage, and interact with users
- **Real-time Messaging**: Send messages to users directly
- **Responsive Design**: Mobile-first design that works on all devices
- **Type Safety**: Full TypeScript support with proper type definitions
- **Utility Functions**: Organized codebase with reusable utilities

## 📁 Project Structure

```
telegram-admin-app/
├── pages/
│   ├── _app.tsx                 # App component with global setup
│   ├── _document.tsx            # Document component for HTML structure
│   ├── index.tsx                # Home page (redirects to login)
│   ├── admin-login.tsx          # Admin login page
│   └── admin-dashboard.tsx      # Main admin dashboard
├── components/
│   └── Layout.tsx               # Layout component
├── styles/
│   └── globals.css              # Global styles with TailwindCSS
├── types/
│   └── index.ts                 # TypeScript type definitions
├── utils/
│   ├── telegram.ts              # Telegram WebApp utilities
│   ├── api.ts                   # API client utilities
│   ├── auth.ts                  # Authentication utilities
│   └── validation.ts            # Form validation utilities
├── hooks/
│   ├── useNotification.ts       # Custom notification hook
│   └── useAuth.ts               # Custom authentication hook
├── public/
│   └── favicon.ico
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # TailwindCSS configuration
├── postcss.config.js            # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 🛠️ Setup Instructions

### 1. Create New Next.js Project

```bash
# Create a new Next.js project with TypeScript
npx create-next-app@latest telegram-admin-app --typescript --tailwind --eslint --app

# Navigate to project directory
cd telegram-admin-app
```

### 2. Install Dependencies

```bash
# Install required dependencies
npm install @heroicons/react

# Install development dependencies (if not already installed)
npm install -D @types/node @types/react @types/react-dom
```

### 3. Project Setup

1. **Replace the default files** with the provided code:
   - Copy all the code from the artifacts above
   - Create the folder structure as shown
   - Replace or create files as needed

2. **Update package.json** with the provided dependencies

3. **Configure Next.js** with the provided `next.config.js`

4. **Setup TailwindCSS** with the provided `tailwind.config.js`

### 4. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://igebeyamarch2025.onrender.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### 6. Deployment

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Follow the prompts to configure your deployment
```

#### Manual Deployment

```bash
# Build the application
npm run build

# The built files will be in the .next folder
# Deploy the entire project to your hosting provider
```

## 📝 Configuration

### API Proxy Configuration

The `next.config.js` file includes API proxy configuration that routes all `/api/*` requests to your backend:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'https://igebeyamarch2025.onrender.com/api/:path*'
    }
  ];
}
```

### Telegram WebApp Integration

The app automatically loads the Telegram WebApp script and initializes the interface. Key features:

- Auto-initialization of Telegram WebApp
- User data extraction from Telegram
- Back button management
- Responsive design for mobile devices

## 🎨 Styling and Design

### TailwindCSS Configuration

The project uses a custom TailwindCSS configuration with:

- Custom color palette
- Extended animations
- Mobile-first responsive design
- Custom components for notifications

### Dark Mode Support

The application includes basic dark mode support through CSS media queries.

## 🔐 Authentication Flow

1. **Login Page**: Admin enters credentials (email, username, password, 2FA)
2. **Validation**: Client-side validation with TypeScript
3. **API Call**: Secure API call to backend with Telegram user data
4. **Token Storage**: JWT token stored in localStorage
5. **Dashboard Access**: Redirect to admin dashboard on success

## 📱 Features

### User Management
- View all users with pagination
- Search and filter users
- Send direct messages to users
- Airdrop free boosts
- View user statistics
- Handle reported users

### Admin Actions
- Secure admin authentication
- Real-time notifications
- Responsive mobile interface
- Telegram WebApp integration

## 🔧 Customization

### Adding New Pages

1. Create a new file in the `pages/` directory
2. Use the `Layout` component for consistent styling
3. Add TypeScript types in `types/index.ts`
4. Create utility functions if needed

### Modifying Styles

1. Update `tailwind.config.js` for theme changes
2. Modify `styles/globals.css` for global styles
3. Use Tailwind utility classes for component styling

### API Integration

1. Use the `ApiClient` utility for all API calls
2. Add new API types in `types/index.ts`
3. Handle errors with the notification system

## 🚨 Security Considerations

- All API calls are proxied through Next.js
- JWT tokens are stored securely
- Form validation on both client and server
- TypeScript provides type safety
- Environment variables for sensitive data

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Telegram WebApp Documentation](https://core.telegram.org/bots/webapps)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

## Quick Start Commands

```bash
# Clone and setup
git clone <your-repo>
cd telegram-admin-app
npm install

# Development
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000` and will redirect to the admin login page.