# Wi-Fi QR Code Generator

A modern, responsive web application for generating QR codes for Wi-Fi networks. Built with Vue 3, TypeScript, and shadcn/vue components, featuring dark/light themes, multi-language support, and professional print/export capabilities.

![Wi-Fi QR Generator](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 🌟 Features

- **🔗 QR Code Generation**: Create QR codes for Wi-Fi networks with support for WPA/WPA2, WEP, and open networks
- **🎨 Theme Support**: Toggle between light and dark themes with system preference detection
- **🌍 Multi-language**: English and Vietnamese language support with Vue I18n
- **🖨️ Print & Export**: Professional print layouts and high-quality image export (PNG)
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **⌨️ Keyboard Shortcuts**: Quick theme toggle (Ctrl+Shift+T) and language switching (Ctrl+Shift+L)
- **🔒 Security**: Client-side only - no data sent to servers
- **♿ Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/wifi-qr-generator.git
   cd wifi-qr-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📖 Usage Guide

### Basic Usage

1. **Enter Wi-Fi Details**
   - Input your Wi-Fi network name (SSID)
   - Select encryption type (WPA/WPA2, WEP, or None)
   - Enter password (if required)

2. **Generate QR Code**
   - QR code generates automatically as you type
   - Preview shows exactly what will be printed/exported

3. **Export Options**
   - **Print**: Click "Print" for optimized paper output
   - **Save Image**: Click "Save as Image" for PNG download

### Advanced Features

- **Theme Toggle**: Click the theme button or press `Ctrl+Shift+T`
- **Language Switch**: Use language selector or press `Ctrl+Shift+L`
- **Password Visibility**: Toggle password visibility with the eye icon

## 🛠️ Technology Stack

### Core Technologies
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework with Composition API
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript development
- **[Vite](https://vitejs.dev/)** - Fast build tool and development server
- **[shadcn/vue](https://www.shadcn-vue.com/)** - Beautiful, accessible UI components

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide Vue](https://lucide.dev/)** - Beautiful SVG icons
- **[Radix Vue](https://www.radix-vue.com/)** - Unstyled, accessible UI primitives

### Functionality
- **[QRCode.js](https://github.com/davidshimjs/qrcodejs)** - QR code generation
- **[html2canvas](https://html2canvas.hertzen.com/)** - Screenshot generation for image export
- **[Vue I18n](https://vue-i18n.intlify.dev/)** - Internationalization support

### Development & Testing
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Vue Test Utils](https://test-utils.vuejs.org/)** - Vue component testing utilities

## 🏗️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run all tests
npm run test:unit        # Run unit tests (watch mode)
npm run test:unit:run    # Run unit tests (single run)
npm run test:unit:coverage # Run with coverage report
npm run test:e2e         # Run E2E tests
npm run test:e2e:headed  # Run E2E tests with browser UI

# Code Quality
npm run lint             # Lint and fix code
npm run type-check       # TypeScript type checking
```

### Environment Setup

1. **Development Environment**
   ```bash
   npm run dev
   ```
   - Hot module replacement enabled
   - TypeScript checking
   - ESLint integration

2. **Production Build**
   ```bash
   npm run build
   npm run preview
   ```
   - Optimized bundle
   - Tree shaking
   - Asset optimization

## 🧪 Testing Infrastructure

### Unit Testing (Vitest)
- **Framework**: Vitest with Vue Test Utils
- **Coverage**: 80%+ target with comprehensive reporting
- **Components**: All Vue components tested for rendering and interactions
- **Utilities**: Export functions, theme management, i18n integration
- **Mocking**: External dependencies (html2canvas, qrcode, localStorage)

```bash
npm run test:unit:coverage  # Generate coverage report
```

### End-to-End Testing (Playwright)
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: iOS Safari, Android Chrome
- **Test Scenarios**:
  - Wi-Fi form validation and QR generation
  - Theme switching and persistence
  - Language switching and translations
  - Print and export functionality
  - Responsive design across viewports
  - Keyboard shortcuts and accessibility

```bash
npm run test:e2e:headed    # Run with browser UI
npm run test:e2e:debug     # Debug mode
```

### Test Organization
```
src/test/                  # Unit tests
├── components/           # Component tests
├── composables/          # Composable tests
├── utils/               # Utility function tests
└── setup.ts             # Test configuration

tests/                    # E2E tests
├── fixtures/            # Test data
├── pages/              # Page Object Models
└── *.spec.ts           # Test specifications
```

## 📁 Project Structure

```
wifi-qr-generator/
├── public/                    # Static assets
├── src/
│   ├── components/           # Vue components
│   │   ├── ui/              # shadcn/vue components
│   │   ├── WifiForm.vue     # Main form component
│   │   ├── QRCodeDisplay.vue # QR code display
│   │   ├── ThemeToggle.vue  # Theme switcher
│   │   └── LanguageToggle.vue # Language selector
│   ├── composables/         # Vue composables
│   │   ├── useTheme.ts      # Theme management
│   │   └── useI18nUtils.ts  # i18n utilities
│   ├── locales/            # Translation files
│   │   ├── en.json         # English translations
│   │   ├── vi.json         # Vietnamese translations
│   │   └── index.ts        # i18n configuration
│   ├── utils/              # Utility functions
│   │   └── export.ts       # Export functionality
│   ├── assets/             # Stylesheets and assets
│   ├── types/              # TypeScript type definitions
│   └── test/               # Unit test files
├── tests/                  # E2E test files
├── docs/                   # Documentation
└── .github/workflows/      # CI/CD configuration
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Follow the existing code style
- Ensure all tests pass before submitting

### Code Style
- Use TypeScript for all new code
- Follow Vue 3 Composition API patterns
- Use shadcn/vue components when possible
- Maintain accessibility standards
- Write meaningful commit messages

## 📋 TODO

### Testing Improvements
- **Fix Remaining Unit Tests**: Resolve 19 failing tests
  - Component rendering issues with shadcn/vue components in test environment
  - Mock refinements for useTheme composable
  - Export utility mock setup improvements
- **Test Enhancements**:
  - Add accessibility testing with axe-core
  - Implement performance testing
  - Add visual regression testing
  - Expand edge case coverage

### CI/CD Integration
- Complete GitHub Actions workflow integration
- Add automated testing on pull requests
- Implement deployment pipeline
- Add code coverage reporting

### Feature Enhancements
- Add more encryption types (WPA3, Enterprise)
- Implement QR code customization (colors, logos)
- Add batch QR code generation
- Support for additional export formats (SVG, PDF)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/vue](https://www.shadcn-vue.com/) for the beautiful UI components
- [Vue.js](https://vuejs.org/) team for the amazing framework
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) for QR code generation
- All contributors and users of this project

---

**Made with ❤️ using Vue 3 + TypeScript**
