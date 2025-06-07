import { test, expect } from '@playwright/test';
import { WiFiQRPage } from './pages/wifi-qr-page';
import { translations } from './fixtures/wifi-data';

test.describe('Theme and Language Functionality', () => {
  let wifiPage: WiFiQRPage;

  test.beforeEach(async ({ page }) => {
    wifiPage = new WiFiQRPage(page);
    await wifiPage.goto();
  });

  test.describe('Theme Toggle', () => {
    test('should start with light theme by default', async () => {
      await wifiPage.expectThemeToBeApplied('light');
      expect(await wifiPage.isDarkTheme()).toBe(false);
    });

    test('should toggle to dark theme when clicked', async () => {
      await wifiPage.toggleTheme();
      await wifiPage.expectThemeToBeApplied('dark');
      expect(await wifiPage.isDarkTheme()).toBe(true);
    });

    test('should toggle back to light theme', async () => {
      // Toggle to dark
      await wifiPage.toggleTheme();
      await wifiPage.expectThemeToBeApplied('dark');
      
      // Toggle back to light
      await wifiPage.toggleTheme();
      await wifiPage.expectThemeToBeApplied('light');
      expect(await wifiPage.isDarkTheme()).toBe(false);
    });

    test('should persist theme preference', async ({ page }) => {
      // Toggle to dark theme
      await wifiPage.toggleTheme();
      await wifiPage.expectThemeToBeApplied('dark');
      
      // Reload page
      await page.reload();
      
      // Theme should still be dark
      await wifiPage.expectThemeToBeApplied('dark');
    });

    test('should respond to keyboard shortcut Ctrl+Shift+T', async () => {
      await wifiPage.pressKeyboardShortcut('theme');
      await wifiPage.expectThemeToBeApplied('dark');
      
      await wifiPage.pressKeyboardShortcut('theme');
      await wifiPage.expectThemeToBeApplied('light');
    });

    test('should update theme toggle button appearance', async () => {
      // In light mode, should show moon icon (to switch to dark)
      await expect(wifiPage.themeToggleButton).toBeVisible();
      
      // Toggle to dark mode
      await wifiPage.toggleTheme();
      
      // Button should still be visible and functional
      await expect(wifiPage.themeToggleButton).toBeVisible();
    });

    test('should maintain theme across form interactions', async () => {
      // Switch to dark theme
      await wifiPage.toggleTheme();
      await wifiPage.expectThemeToBeApplied('dark');
      
      // Fill form
      await wifiPage.fillWiFiForm('TestNetwork', 'WPA/WPA2', 'password123');
      
      // Theme should still be dark
      await wifiPage.expectThemeToBeApplied('dark');
    });
  });

  test.describe('Language Toggle', () => {
    test('should start with English by default', async () => {
      await wifiPage.expectLanguageToBeApplied('en');
      await wifiPage.expectTranslation(translations.en.appTitle);
      await wifiPage.expectTranslation(translations.en.ssidLabel);
    });

    test('should switch to Vietnamese', async () => {
      await wifiPage.switchLanguage('Tiếng Việt');
      
      await wifiPage.expectLanguageToBeApplied('vi');
      await wifiPage.expectTranslation(translations.vi.appTitle);
      await wifiPage.expectTranslation(translations.vi.ssidLabel);
    });

    test('should switch back to English', async () => {
      // Switch to Vietnamese
      await wifiPage.switchLanguage('Tiếng Việt');
      await wifiPage.expectLanguageToBeApplied('vi');
      
      // Switch back to English
      await wifiPage.switchLanguage('English');
      await wifiPage.expectLanguageToBeApplied('en');
      await wifiPage.expectTranslation(translations.en.appTitle);
    });

    test('should persist language preference', async ({ page }) => {
      // Switch to Vietnamese
      await wifiPage.switchLanguage('Tiếng Việt');
      await wifiPage.expectLanguageToBeApplied('vi');
      
      // Reload page
      await page.reload();
      
      // Language should still be Vietnamese
      await wifiPage.expectLanguageToBeApplied('vi');
      await wifiPage.expectTranslation(translations.vi.appTitle);
    });

    test('should respond to keyboard shortcut Ctrl+Shift+L', async () => {
      await wifiPage.pressKeyboardShortcut('language');
      await wifiPage.expectLanguageToBeApplied('vi');
      
      await wifiPage.pressKeyboardShortcut('language');
      await wifiPage.expectLanguageToBeApplied('en');
    });

    test('should translate form labels correctly', async () => {
      // Check English labels
      await wifiPage.expectTranslation(translations.en.ssidLabel);
      await wifiPage.expectTranslation(translations.en.encryptionLabel);
      await wifiPage.expectTranslation(translations.en.passwordLabel);
      
      // Switch to Vietnamese
      await wifiPage.switchLanguage('Tiếng Việt');
      
      // Check Vietnamese labels
      await wifiPage.expectTranslation(translations.vi.ssidLabel);
      await wifiPage.expectTranslation(translations.vi.encryptionLabel);
      await wifiPage.expectTranslation(translations.vi.passwordLabel);
    });

    test('should translate button text correctly', async () => {
      // Check English buttons
      await wifiPage.expectTranslation(translations.en.saveImageButton);
      await wifiPage.expectTranslation(translations.en.printButton);
      
      // Switch to Vietnamese
      await wifiPage.switchLanguage('Tiếng Việt');
      
      // Check Vietnamese buttons
      await wifiPage.expectTranslation(translations.vi.saveImageButton);
      await wifiPage.expectTranslation(translations.vi.printButton);
    });

    test('should translate QR display content', async () => {
      // Fill form to show QR display
      await wifiPage.fillWiFiForm('TestNetwork', 'WPA/WPA2', 'password123');
      await wifiPage.waitForQRCodeGeneration();
      
      // Check English QR title
      await wifiPage.expectTranslation(translations.en.qrTitle);
      
      // Switch to Vietnamese
      await wifiPage.switchLanguage('Tiếng Việt');
      
      // Check Vietnamese QR title
      await wifiPage.expectTranslation(translations.vi.qrTitle);
    });

    test('should maintain form data when switching languages', async () => {
      const ssid = 'TestNetwork';
      const password = 'password123';
      
      // Fill form in English
      await wifiPage.fillWiFiForm(ssid, 'WPA/WPA2', password);
      
      // Switch to Vietnamese
      await wifiPage.switchLanguage('Tiếng Việt');
      
      // Form data should be maintained
      expect(await wifiPage.getSSIDValue()).toBe(ssid);
      expect(await wifiPage.getPasswordValue()).toBe(password);
      
      // QR code should still be visible
      await wifiPage.expectQRDisplayToBeVisible();
    });

    test('should show correct language in selector', async () => {
      // Should show EN initially
      await expect(wifiPage.languageSelector).toContainText('EN');
      
      // Switch to Vietnamese
      await wifiPage.switchLanguage('Tiếng Việt');
      
      // Should show VI
      await expect(wifiPage.languageSelector).toContainText('VI');
    });
  });

  test.describe('Combined Theme and Language', () => {
    test('should maintain both theme and language preferences', async ({ page }) => {
      // Set dark theme and Vietnamese language
      await wifiPage.toggleTheme();
      await wifiPage.switchLanguage('Tiếng Việt');
      
      await wifiPage.expectThemeToBeApplied('dark');
      await wifiPage.expectLanguageToBeApplied('vi');
      
      // Reload page
      await page.reload();
      
      // Both preferences should be maintained
      await wifiPage.expectThemeToBeApplied('dark');
      await wifiPage.expectLanguageToBeApplied('vi');
    });

    test('should work with keyboard shortcuts in any order', async () => {
      // Use theme shortcut first
      await wifiPage.pressKeyboardShortcut('theme');
      await wifiPage.expectThemeToBeApplied('dark');
      
      // Use language shortcut
      await wifiPage.pressKeyboardShortcut('language');
      await wifiPage.expectLanguageToBeApplied('vi');
      
      // Use shortcuts again
      await wifiPage.pressKeyboardShortcut('theme');
      await wifiPage.expectThemeToBeApplied('light');
      
      await wifiPage.pressKeyboardShortcut('language');
      await wifiPage.expectLanguageToBeApplied('en');
    });

    test('should maintain functionality in dark mode with Vietnamese', async () => {
      // Set dark theme and Vietnamese language
      await wifiPage.toggleTheme();
      await wifiPage.switchLanguage('Tiếng Việt');
      
      // Fill form and verify functionality
      await wifiPage.fillWiFiForm('MạngWiFi', 'WPA/WPA2', 'mậtkhẩu123');
      await wifiPage.waitForQRCodeGeneration();
      
      await wifiPage.expectQRDisplayToBeVisible();
      await wifiPage.expectButtonsToBeEnabled();
      await wifiPage.expectTranslation(translations.vi.qrTitle);
    });
  });
});
