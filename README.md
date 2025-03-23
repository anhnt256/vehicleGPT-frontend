# SuperTodo - Advanced Task Management Application

SuperTodo is a modern task management application featuring a Kanban interface, drag-and-drop functionality, and numerous advanced features.

## Setup Instructions

### Requirements

- Node.js (v18 or higher)
- pnpm/npm/yarn

### Installation Steps

1. **Clone repository**

   ```bash
   git clone https://github.com/yourusername/super-todo.git
   cd super-todo
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # Or
   npm install
   ```

3. **Configure environment variables**

   - Create a `.env` file based on `.env.example`
   - Update the necessary keys:

     ```
     VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
     CLERK_SIGN_IN_FORCE_REDIRECT_URL='/dashboard'
     CLERK_SIGN_UP_FORCE_REDIRECT_URL='/dashboard'
     VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
     VITE_API_ENDPOINT=http://localhost:4000

     # Authentication
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRES_IN=1d
     ```

4. **Start development server**

   ```bash
   pnpm dev
   # Or
   npm run dev
   ```

5. **Build for production**
   ```bash
   pnpm build
   # Or
   npm run build
   ```

## Architecture Decisions

### Frontend

- **React + TypeScript**: Ensures type-safety and better development experience
- **React Router**: Manages routing and protects authenticated routes
- **Clerk**: Modern authentication solution with user and session management
- **GraphQL**: Used for the main API, optimizing payloads and requests
- **REST API**: Used for specific separate endpoints
- **dnd-kit**: High-performance drag-and-drop library for the Kanban experience
- **Context API**: Global state management for authentication
- **Sonner**: Modern toast notifications
- **Tailwind CSS**: Flexible and efficient styling

### State Management

- **Local State**: Using `useState` for component state
- **Global State**: Context API for auth state and user role
- **API Integration**: Custom hooks for API interaction

### Authentication & Authorization

- **Clerk + JWT**: Using Clerk for authentication and passing JWT tokens to the backend
- **Cookie-based**: Storing tokens and roles in cookies instead of localStorage
- **Role-based Access**: Distinguishing free/paid users and limiting features

## Assumptions & Notes

### User Interface

- **Responsive Design**: Works on both mobile and desktop devices
- **Light/Dark Mode**: Default is dark mode, suitable for productivity applications

### User Roles

- **Free User**: Can use the List view and basic features
- **Paid User**: Unlocks Kanban view, Notes, and Organizations features

### API Integration

- Backend GraphQL runs at the address configured in `VITE_GRAPHQL_ENDPOINT`
- Backend REST API runs at the address configured in `VITE_API_ENDPOINT`
- JWT tokens are stored in cookies and automatically sent with each request

### Task Statuses

- Main statuses: TODO, IN_PROGRESS, BLOCKED, REVIEW, DONE, CANCELED
- Tasks are automatically marked as Completed when moved to DONE status

### Browser Support

- Supports modern browsers: Chrome, Firefox, Safari, Edge
- Requires JavaScript to be enabled

### Future Development

- Time tracking features
- AI integration for automatic task classification and suggestions
- Integration with third-party services: Google Calendar, Microsoft Teams, Slack

### Development Notes

- Using ESLint and Prettier for code quality
- Following naming conventions and folder organization
- Ensuring complete type checking when developing with TypeScript

## Additional Architectural Considerations

### Project Architecture Evolution

- **NextJS for Small Projects**: For smaller todo applications, using NextJS would be optimal as it handles both FE and BE in a single codebase, reducing complexity and development time.
- **Separate FE/BE for Scalability**: As the project grows into something more feature-rich like ClickUp, separating frontend and backend becomes necessary for better maintainability and scalability.

### Technology Selection Flexibility

- **React vs Vue vs LynxJS**: While we've chosen React for this implementation, Vue could be an alternative for easier onboarding. For cross-platform needs, ByteDance's LynxJS would provide the advantage of supporting iOS and Android from a single codebase.
- **Progressive Enhancement**: Our architecture allows for transitioning between technologies as the project requirements evolve.

### State Management Scaling

- **Context API for Small to Medium Apps**: Currently using Context API which adequately covers our needs while avoiding "context hell" through careful design.
- **Redux for Complex State**: For larger applications with more complex state requirements, we should consider migrating to Redux for more robust state management.

### Expansion Opportunities

- **Team Collaboration**: Adding member invitation system and team management features
- **Organization Structure**: Implementing organization hierarchy to manage different workspaces (Work, Personal, Departments)
- **Custom Workflows**: Allowing users to define custom statuses and workflows for different projects
- **Integration Ecosystem**: Building an API for third-party integrations and plugins

## Troubleshooting

### Authentication Issues

- Ensure CLERK_PUBLISHABLE_KEY is configured correctly
- Check permissions and domains in your Clerk dashboard

### API Issues

- Verify the backend server is running
- Confirm GraphQL and API endpoints are configured correctly

### UI Issues

- Clear cache and cookies if experiencing layout problems
- Check browser console for JavaScript errors

---

**SuperTodo Exercise for Senior Full Stack CoverGo 2025**
