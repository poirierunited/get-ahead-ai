# 🚀 Get Ahead AI

AI-powered interview preparation platform built with Next.js, Firebase, and Gemini AI.

## 🌟 Features

- 🎯 **AI Interview Generation**: Create custom interview questions based on role, level, and tech stack
- 🗣️ **Voice Interviews**: Practice interviews with AI using voice interaction (VAPI)
- 📊 **Intelligent Feedback**: Get detailed feedback and scoring on interview performance
- 🌐 **Internationalization**: Support for multiple languages (English, Spanish)
- 🔐 **Secure Authentication**: Firebase-based authentication system
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **AI Models**: Google Gemini 2.0 Flash
- **Voice**: VAPI SDK
- **State Management**: React Hooks
- **Validation**: Zod
- **Internationalization**: next-intl

## 📚 Documentation

For comprehensive documentation, visit our **[Documentation Center](./docs/README.md)**.

### Quick Links

- **[Logging System](./docs/logging.md)** - Structured logging guide
- **[API Reference](./docs/api/README.md)** - API endpoints _(coming soon)_
- **[Development Guide](./docs/guides/quick-start.md)** - Getting started _(coming soon)_
- **[Architecture](./docs/architecture/overview.md)** - System architecture _(coming soon)_

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Firebase account
- Google Cloud account (for Gemini AI)
- VAPI account (for voice interviews)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd get-ahead-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Firebase Client
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY=your_private_key

   # Google AI
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

   # VAPI
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key

   # App
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
get-ahead-ai/
├── app/                          # Next.js App Router
│   ├── [locale]/                # Internationalized routes
│   │   ├── (auth)/              # Authentication pages
│   │   ├── (root)/              # Main app pages
│   │   └── api/                 # API routes
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── ui/                      # Shadcn UI components
│   └── ...                      # App components
├── constants/                    # Constants and config
├── docs/                        # 📚 Documentation center
│   ├── README.md               # Documentation index
│   ├── logging.md              # Logging guide
│   └── .../                    # Organized docs
├── firebase/                    # Firebase config
│   ├── admin.ts                # Admin SDK
│   └── client.ts               # Client SDK
├── lib/                         # Utilities and business logic
│   ├── actions/                # Server actions
│   ├── ai/                     # AI integration
│   ├── auth/                   # Auth utilities
│   ├── errors/                 # Error handling
│   ├── repositories/           # Data access layer
│   ├── schemas/                # Zod schemas
│   ├── services/               # Business logic
│   ├── logger.ts               # Logging system
│   └── utils.ts                # Utilities
├── messages/                    # i18n translations
│   ├── en.json                 # English
│   └── es.json                 # Spanish
├── public/                      # Static assets
└── types/                       # TypeScript types
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Configure environment variables
4. Deploy!

For detailed deployment instructions, see [Deployment Guide](./docs/guides/deployment.md) _(coming soon)_.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines _(coming soon)_.

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Use functional components and hooks
- Follow the [Cursor Rules](./.cursorrules) for code conventions
- Write meaningful commit messages (Conventional Commits)
- Add tests for new features
- Update documentation

## 📊 Monitoring and Logging

This project uses a structured logging system. For detailed information:

- **[Logging Guide](./docs/logging.md)** - Complete logging documentation
- All logs are JSON-formatted for easy parsing
- Use `LogCategory` enum for consistent categorization
- Track requests with `requestId` for end-to-end tracing

Example:

```typescript
import { logger, LogCategory } from '@/lib/logger';

logger.info('Interview generated successfully', {
  category: LogCategory.API_RESPONSE,
  userId,
  interviewId,
  duration: 1250,
});
```

## 🔐 Security

- Rate limiting on API endpoints
- Firebase Authentication for user management
- Session-based authentication with cookies
- Input validation with Zod schemas
- Secure environment variable handling

## 📝 License

This project is proprietary software. All rights reserved.

## 📞 Support

For questions or support:

- Check the [Documentation](./docs/README.md)
- Review [Troubleshooting Guide](./docs/operations/troubleshooting.md) _(coming soon)_
- Contact the development team

---

**Built with ❤️ using Next.js, Firebase, and Gemini AI**
