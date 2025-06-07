# Contributing to Wi-Fi QR Code Generator

Thank you for your interest in contributing to the Wi-Fi QR Code Generator! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git

### Development Setup
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/wifi-qr-generator.git
   cd wifi-qr-generator
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Development Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `test/description` - Test improvements
- `refactor/description` - Code refactoring

### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat(qr): add support for WPA3 encryption
fix(theme): resolve dark mode persistence issue
docs(readme): update installation instructions
test(unit): add tests for export functionality
```

### Code Style
- Use TypeScript for all new code
- Follow Vue 3 Composition API patterns
- Use shadcn/vue components when available
- Maintain consistent formatting with Prettier
- Follow ESLint rules

### Testing Requirements
- Write unit tests for new components and utilities
- Add E2E tests for new user-facing features
- Ensure all tests pass before submitting PR
- Maintain or improve test coverage

## 📝 Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the coding standards
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Run the test suite**:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```
6. **Commit your changes** with descriptive messages
7. **Push to your fork** and create a pull request
8. **Fill out the PR template** completely
9. **Respond to feedback** and make requested changes

### PR Checklist
- [ ] Tests pass locally
- [ ] Code follows project style guidelines
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or clearly documented)
- [ ] PR description explains the changes
- [ ] Screenshots included for UI changes

## 🧪 Testing Guidelines

### Unit Tests
- Test component rendering and behavior
- Mock external dependencies appropriately
- Use descriptive test names
- Group related tests with `describe` blocks

### E2E Tests
- Test complete user workflows
- Use Page Object Model pattern
- Test across different browsers and devices
- Include accessibility testing

### Running Tests
```bash
# Unit tests
npm run test:unit
npm run test:unit:coverage

# E2E tests
npm run test:e2e
npm run test:e2e:headed

# All tests
npm test
```

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots or videos if applicable

Use the bug report template when creating issues.

## 💡 Feature Requests

For new features:
- Check existing issues first
- Provide clear use case and rationale
- Consider implementation complexity
- Be open to discussion and feedback

## 📚 Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update TESTING.md for test-related changes
- Include examples in documentation

## 🎯 Priority Areas

We especially welcome contributions in these areas:

### High Priority
- Fixing remaining unit test failures
- Improving test coverage
- Accessibility enhancements
- Performance optimizations

### Medium Priority
- Additional encryption type support
- QR code customization features
- Export format improvements
- Mobile experience enhancements

### Low Priority
- UI/UX improvements
- Additional language support
- Advanced configuration options

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the project

## 📞 Getting Help

- Create an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Check existing documentation first
- Be patient and respectful when asking for help

## 🏆 Recognition

Contributors will be:
- Listed in the project README
- Credited in release notes
- Invited to join the maintainer team (for significant contributions)

Thank you for contributing to the Wi-Fi QR Code Generator! 🎉
