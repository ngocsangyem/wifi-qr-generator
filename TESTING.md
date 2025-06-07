# Testing Documentation

This document provides comprehensive information about the testing infrastructure for the Wi-Fi QR Code Generator application.

## Overview

The application uses a dual testing approach:
- **Unit Tests**: Vitest for component and utility testing
- **E2E Tests**: Playwright for end-to-end browser testing

## Test Structure

```
src/
├── test/
│   ├── setup.ts              # Vitest setup and mocks
│   ├── utils.ts               # Test utilities and helpers
│   ├── components/            # Component unit tests
│   ├── composables/           # Composable unit tests
│   └── utils/                 # Utility function tests
tests/
├── fixtures/                  # Test data and fixtures
├── pages/                     # Page Object Models
├── wifi-form.spec.ts         # WiFi form E2E tests
├── theme-language.spec.ts     # Theme/language E2E tests
├── print-export.spec.ts      # Print/export E2E tests
└── responsive.spec.ts        # Responsive design E2E tests
```

## Running Tests

### Unit Tests
```bash
# Run unit tests in watch mode
npm run test:unit

# Run unit tests once
npm run test:unit:run

# Run with coverage report
npm run test:unit:coverage

# Run with UI interface
npm run test:unit:ui
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run with browser UI visible
npm run test:e2e:headed

# Run in debug mode
npm run test:e2e:debug

# View test report
npm run test:e2e:report

# Run with Playwright UI
npm run test:e2e:ui
```

### All Tests
```bash
# Run both unit and E2E tests
npm test
```

## Test Coverage

### Unit Tests Cover:
- **Components**: WifiForm, QRCodeDisplay, ThemeToggle, LanguageToggle
- **Composables**: useTheme, useI18nUtils
- **Utilities**: Export functions, filename generation
- **i18n**: Translation loading and locale switching
- **Mocking**: External dependencies (html2canvas, qrcode, localStorage, clipboard)

### E2E Tests Cover:
- **WiFi Form Functionality**:
  - Form input validation
  - QR code generation for different encryption types
  - Password visibility toggle
  - Button state management
  - Special character handling
  - Vietnamese character support

- **Theme and Language**:
  - Light/dark theme switching
  - Theme persistence across sessions
  - Language switching (English/Vietnamese)
  - Language persistence
  - Keyboard shortcuts (Ctrl+Shift+T, Ctrl+Shift+L)
  - Combined theme and language scenarios

- **Print and Export**:
  - Image download functionality
  - Filename generation and sanitization
  - Print dialog triggering
  - Content formatting for print/export
  - Multi-language print layouts
  - Theme compatibility

- **Responsive Design**:
  - Mobile, tablet, desktop, and large screen viewports
  - Layout adaptation across screen sizes
  - Touch target sizing
  - Content overflow handling
  - Cross-device consistency

## Test Data and Fixtures

### WiFi Network Test Cases:
- **WPA/WPA2 Network**: Standard encrypted network
- **WEP Network**: Legacy encryption
- **Open Network**: No password required
- **Special Characters**: Networks with symbols and punctuation
- **Vietnamese Network**: UTF-8 character support
- **Long Network**: Extended SSID and password lengths

### Viewport Sizes:
- **Mobile**: 375x667 (iPhone-like)
- **Tablet**: 768x1024 (iPad-like)
- **Desktop**: 1024x768 (Standard laptop)
- **Large**: 1440x900 (Large desktop)

## Mocking Strategy

### External Dependencies:
- **html2canvas**: Mocked to return predictable canvas data
- **qrcode**: Mocked QR generation
- **localStorage**: In-memory mock implementation
- **clipboard API**: Mocked read/write operations
- **window.matchMedia**: Theme preference detection
- **window.print**: Print dialog triggering

### Component Mocking:
- **i18n**: Full translation mock with English and Vietnamese
- **Canvas Context**: 2D rendering context mock
- **DOM APIs**: File download and URL creation

## Page Object Model

The E2E tests use Page Object Model pattern for maintainable test code:

```typescript
class WiFiQRPage {
  // Locators for all page elements
  readonly ssidInput: Locator;
  readonly encryptionSelect: Locator;
  // ... other elements

  // High-level actions
  async fillWiFiForm(ssid, encryption, password) { }
  async toggleTheme() { }
  async switchLanguage(language) { }
  // ... other actions

  // Assertions
  async expectFormToBeVisible() { }
  async expectQRDisplayToBeVisible() { }
  // ... other expectations
}
```

## CI/CD Integration

### GitHub Actions Configuration:
```yaml
- name: Install dependencies
  run: npm ci

- name: Run unit tests
  run: npm run test:unit:run

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: test-results
    path: test-results/
```

### Test Reports:
- **Unit Tests**: Coverage reports in HTML and JSON
- **E2E Tests**: Playwright HTML report with screenshots and videos
- **Artifacts**: Test results, screenshots, and videos uploaded on failure

## Best Practices

### Unit Testing:
1. **Isolation**: Each test is independent and can run in any order
2. **Mocking**: External dependencies are properly mocked
3. **Coverage**: Aim for 80%+ code coverage
4. **Assertions**: Use specific, meaningful assertions
5. **Setup**: Consistent test setup with proper cleanup

### E2E Testing:
1. **Page Objects**: Use Page Object Model for maintainable tests
2. **Waiting**: Proper waiting for elements and async operations
3. **Data**: Use test fixtures for consistent test data
4. **Isolation**: Tests don't depend on each other
5. **Cleanup**: Proper browser state management

### General:
1. **Naming**: Descriptive test names that explain the scenario
2. **Organization**: Logical grouping with describe blocks
3. **Documentation**: Clear comments for complex test logic
4. **Maintenance**: Regular updates as features change
5. **Performance**: Efficient test execution and parallel running

## Troubleshooting

### Common Issues:
1. **Flaky Tests**: Use proper waiting strategies and stable selectors
2. **Timeout Issues**: Increase timeouts for slow operations
3. **Mock Problems**: Verify mock implementations match real APIs
4. **Browser Issues**: Ensure Playwright browsers are installed
5. **Coverage Gaps**: Check for untested code paths

### Debug Commands:
```bash
# Debug specific test
npm run test:e2e:debug -- --grep "specific test name"

# Run tests with verbose output
npm run test:unit -- --reporter=verbose

# Generate coverage report
npm run test:unit:coverage
```

## Maintenance

### Regular Tasks:
1. **Update Dependencies**: Keep testing libraries current
2. **Review Coverage**: Ensure new code is tested
3. **Update Fixtures**: Maintain test data relevance
4. **Performance**: Monitor test execution times
5. **Documentation**: Keep testing docs updated

### When Adding Features:
1. **Unit Tests**: Test new components and utilities
2. **E2E Tests**: Test new user workflows
3. **Fixtures**: Add relevant test data
4. **Page Objects**: Update page models
5. **Documentation**: Update test documentation
