# StudyMate AI - Your AI-Powered Study Abroad Companion

StudyMate AI is a comprehensive web application designed to assist international students with their study abroad journey. It provides personalized guidance, visa assistance, and roadmap generation using AI technology.

## Features

### 1. Authentication System
- Secure login and signup functionality
- Local storage-based session management
- User profile management

### 2. Profile Management
- Personal information collection
- Academic interests selection
- Preferred countries selection
- Budget range specification
- English proficiency level
- Timeline preferences
- Novita AI API key integration

### 3. Dashboard
- Overview of study abroad journey
- Quick access to key features
- Progress tracking
- Personalized recommendations

### 4. Visa Assistant (AI Chatbot)
- Real-time visa guidance
- Document requirements information
- Application process assistance
- Interview preparation tips
- Financial requirements guidance
- Quick question templates
- Document checklist
- Streaming AI responses
- Message categorization
- Visual indicators for different types of information

### 5. Roadmap Generator
- Personalized timeline creation
- Task categorization
- Priority-based task organization
- Timeline-based task distribution
- Customized recommendations based on:
  - Academic interests
  - Preferred countries
  - Budget constraints
  - English proficiency
  - Application timeline

## Technical Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui Components
- React Router DOM
- React Query
- OpenAI SDK

### Key Dependencies
- @radix-ui/react-* (UI Components)
- @tanstack/react-query (Data Fetching)
- class-variance-authority (Styling)
- date-fns (Date Handling)
- lucide-react (Icons)
- react-hook-form (Form Management)
- zod (Schema Validation)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- Novita AI API key (for enhanced AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd study-mate-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_NOVITA_API_KEY=your_novita_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── AuthForm.tsx   # Authentication form
│   ├── Dashboard.tsx  # Main dashboard
│   ├── ProfileForm.tsx # User profile management
│   ├── RoadmapGenerator.tsx # Roadmap generation
│   └── VisaChatbot.tsx # AI-powered visa assistant
├── lib/               # Utility functions and API clients
│   └── novita-ai.ts   # Novita AI integration
├── pages/             # Page components
│   ├── Index.tsx      # Main application page
│   └── NotFound.tsx   # 404 page
├── hooks/             # Custom React hooks
└── App.tsx           # Application root
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Style

The project uses ESLint for code linting and follows TypeScript best practices. Run `npm run lint` to check for any code style issues.

## Production Deployment

For production deployment:

1. Set up a proper backend server to handle API requests
2. Configure environment variables
3. Build the application:
```bash
npm run build
```

4. Deploy the contents of the `dist` directory to your hosting service

## Security Considerations

- API keys should never be exposed in client-side code
- Implement proper authentication and authorization
- Use environment variables for sensitive data
- Set up CORS properly in production
- Implement rate limiting for API requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.
