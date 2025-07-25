# Contributing to Student Elections 2024

Thank you for your interest in contributing to the Student Elections 2024 voting system! This guide will help you get started.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/your-repository-name.git
   cd your-repository-name
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up your environment** (see README.md for details)
5. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Keep components small and focused
- Use meaningful variable and function names
- Ensure proper error handling

### Frontend Guidelines

- Use React functional components with hooks
- Follow the established component structure in `client/src/components/`
- Use Tailwind CSS for styling
- Implement proper loading states and error handling
- Ensure responsive design for mobile and desktop

### Backend Guidelines

- Use Express.js with TypeScript
- Follow RESTful API conventions
- Validate all inputs using Zod schemas
- Implement proper error handling and logging
- Use the established storage interface patterns

### Database Guidelines

- Use Drizzle ORM for all database operations
- Update schemas in `shared/schema.ts`
- Run `npm run db:push` to apply schema changes
- Ensure proper foreign key relationships

## Testing

Before submitting a pull request:

1. **Test the full user flow**:
   - Registration with university email
   - Login after registration
   - Voting process (ensure one-time voting works)
   - Admin dashboard functionality

2. **Test edge cases**:
   - Invalid email domains
   - Duplicate registrations
   - Multiple voting attempts
   - Session expiration

3. **Verify responsive design** on different screen sizes

## Submitting Changes

1. **Commit your changes** with clear, descriptive messages:
   ```bash
   git add .
   git commit -m "Add feature: description of what you added"
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what was added/changed
   - Screenshots if UI changes were made
   - Steps to test the changes

## Pull Request Guidelines

- Ensure your code follows the existing style
- Add appropriate error handling
- Test all functionality thoroughly
- Update documentation if needed
- Keep PRs focused on a single feature or fix

## Reporting Issues

When reporting bugs or suggesting features:

1. **Check existing issues** first
2. **Use clear, descriptive titles**
3. **Provide steps to reproduce** for bugs
4. **Include screenshots** for UI issues
5. **Specify your environment** (browser, OS, etc.)

## Questions?

If you have questions about contributing, feel free to:
- Open an issue for discussion
- Ask in the pull request comments
- Contact the maintainers

Thank you for contributing to making student elections more accessible and secure!