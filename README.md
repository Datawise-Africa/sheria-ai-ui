# Kenya Law AI - Web Application

A modern React-based web application for the Kenya Law AI platform, featuring an intelligent chatbot interface and comprehensive legal information dashboard.

## Features

- **AI Legal Assistant**: Chat interface for asking questions about Kenyan law
- **Chat History**: Persistent storage of conversation history with export functionality
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **Real-time Chat**: Interactive chat experience with typing indicators
- **Dashboard**: Overview of legal statistics and quick actions
- **Navigation**: Clean, intuitive navigation between different sections

## Tech Stack

- **React 19** with TypeScript
- **React Router v7** with `createBrowserRouter`
- **Tailwind CSS v4** for styling
- **Custom Hooks** for chat functionality
- **Local Storage** for chat history persistence
- **Responsive Design** with mobile-first approach

## Getting Started

### Prerequisites

- Node.js v18+ 
- pnpm package manager

### Installation

1. Navigate to the web package:
   ```bash
   cd packages/web
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   └── Navigation.tsx          # Main navigation component
├── hooks/
│   └── useChat.ts              # Chat functionality hook
├── pages/
│   ├── Dashboard.tsx           # Main dashboard page
│   └── Chatbot.tsx            # AI chat interface
├── lib/
│   └── utils.ts               # Utility functions
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
└── index.css                  # Global styles with Tailwind
```

## Available Routes

- `/` - Dashboard with overview and quick actions
- `/chat` - AI Legal Assistant chat interface

## Chat Features

- **Real-time Messaging**: Send and receive messages instantly
- **Persistent History**: Chat history is saved in local storage
- **Export Functionality**: Download chat history as JSON
- **Clear History**: Remove all chat history
- **Case References**: AI responses include relevant legal case references
- **Typing Indicators**: Visual feedback during AI processing

## Development

### Adding New Pages

1. Create a new component in the `pages/` directory
2. Add the route to `App.tsx` using `createBrowserRouter`
3. Update navigation in `Navigation.tsx` if needed

### Styling

The application uses Tailwind CSS v4 with custom components. All styling is done through utility classes and component-based CSS.

### State Management

Chat state is managed through a custom `useChat` hook that handles:
- Message storage and retrieval
- Local storage persistence
- API interactions (currently mocked)
- Loading states

## Future Enhancements

- **Authentication**: User login and registration
- **Real API Integration**: Connect to backend services
- **Advanced Search**: Legal document search functionality
- **User Profiles**: Personalized chat history and preferences
- **Dark Mode**: Theme switching capability
- **Mobile App**: React Native companion app

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new components
3. Ensure responsive design for mobile devices
4. Add proper error handling and loading states
5. Test chat functionality thoroughly

## License

This project is part of the Kenya Law AI platform and follows the same licensing terms.
