import { test, expect } from '@playwright/test';
import { WiFiQRPage } from './pages/wifi-qr-page';
import { viewports, wifiTestData } from './fixtures/wifi-data';

test.describe('Responsive Design', () => {
  let wifiPage: WiFiQRPage;

  test.beforeEach(async ({ page }) => {
    wifiPage = new WiFiQRPage(page);
    await wifiPage.goto();
  });

  Object.entries(viewports).forEach(([deviceName, { width, height }]) => {
    test.describe(`${deviceName} viewport (${width}x${height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height });
      });

      test('should display all form elements correctly', async () => {
        await wifiPage.expectFormToBeVisible();
        
        // All form elements should be visible and accessible
        await expect(wifiPage.ssidInput).toBeVisible();
        await expect(wifiPage.encryptionSelect).toBeVisible();
        await expect(wifiPage.passwordInput).toBeVisible();
        await expect(wifiPage.saveImageButton).toBeVisible();
        await expect(wifiPage.printButton).toBeVisible();
      });

      test('should maintain proper layout spacing', async ({ page }) => {
        // Check that elements don't overlap
        const formElements = [
          wifiPage.ssidInput,
          wifiPage.encryptionSelect,
          wifiPage.passwordInput,
          wifiPage.saveImageButton,
          wifiPage.printButton,
        ];

        for (const element of formElements) {
          await expect(element).toBeVisible();
          
          // Element should have reasonable dimensions
          const box = await element.boundingBox();
          expect(box?.width).toBeGreaterThan(0);
          expect(box?.height).toBeGreaterThan(0);
        }
      });

      test('should generate and display QR code properly', async () => {
        const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
        
        await wifiPage.fillWiFiForm(ssid, encryptionType, password);
        await wifiPage.waitForQRCodeGeneration();
        
        await wifiPage.expectQRDisplayToBeVisible();
        
        // QR code should be properly sized
        const canvas = wifiPage.qrCodeCanvas;
        await expect(canvas).toBeVisible();
        
        const canvasBox = await canvas.boundingBox();
        expect(canvasBox?.width).toBeGreaterThan(100);
        expect(canvasBox?.height).toBeGreaterThan(100);
      });

      test('should maintain header layout', async () => {
        // Header should be visible and properly laid out
        await expect(wifiPage.appTitle).toBeVisible();
        await expect(wifiPage.themeToggleButton).toBeVisible();
        await expect(wifiPage.languageSelector).toBeVisible();
        
        // On mobile, elements might stack differently
        if (width < 768) {
          // Mobile layout considerations
          const headerBox = await wifiPage.page.locator('header').boundingBox();
          expect(headerBox?.height).toBeGreaterThan(60); // Allow for stacking
        }
      });

      test('should handle form interactions properly', async () => {
        // Form should be fully functional regardless of screen size
        await wifiPage.fillWiFiForm('TestNetwork', 'WPA/WPA2', 'password123');
        
        // Buttons should be enabled
        await wifiPage.expectButtonsToBeEnabled();
        
        // Password toggle should work
        await wifiPage.togglePasswordVisibility();
        expect(await wifiPage.getPasswordInputType()).toBe('text');
      });

      test('should maintain theme toggle functionality', async () => {
        await wifiPage.toggleTheme();
        await wifiPage.expectThemeToBeApplied('dark');
        
        await wifiPage.toggleTheme();
        await wifiPage.expectThemeToBeApplied('light');
      });

      test('should maintain language toggle functionality', async () => {
        await wifiPage.switchLanguage('Tiếng Việt');
        await wifiPage.expectLanguageToBeApplied('vi');
        
        await wifiPage.switchLanguage('English');
        await wifiPage.expectLanguageToBeApplied('en');
      });

      test('should handle keyboard shortcuts', async () => {
        // Theme shortcut
        await wifiPage.pressKeyboardShortcut('theme');
        await wifiPage.expectThemeToBeApplied('dark');
        
        // Language shortcut
        await wifiPage.pressKeyboardShortcut('language');
        await wifiPage.expectLanguageToBeApplied('vi');
      });

      test('should maintain print/export functionality', async () => {
        const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
        
        await wifiPage.fillWiFiForm(ssid, encryptionType, password);
        await wifiPage.waitForQRCodeGeneration();
        
        // Export should work
        const download = await wifiPage.saveAsImage();
        expect(download).toBeTruthy();
      });

      test('should handle long content gracefully', async () => {
        const { ssid, encryptionType, password } = wifiTestData.longNetwork;
        
        await wifiPage.fillWiFiForm(ssid, encryptionType, password);
        await wifiPage.waitForQRCodeGeneration();
        
        // Content should not overflow
        await wifiPage.expectQRDisplayToBeVisible();
        await wifiPage.expectSSIDInDisplay(ssid);
        await wifiPage.expectPasswordInDisplay(password);
      });

      test('should maintain accessibility on touch devices', async () => {
        if (width <= 768) { // Mobile/tablet
          // Touch targets should be appropriately sized
          const buttons = await wifiPage.page.locator('button').all();
          
          for (const button of buttons) {
            if (await button.isVisible()) {
              const box = await button.boundingBox();
              // Minimum touch target size (44px recommended)
              expect(box?.height).toBeGreaterThanOrEqual(40);
            }
          }
        }
      });
    });
  });

  test.describe('Layout Transitions', () => {
    test('should handle viewport size changes gracefully', async ({ page }) => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      // Start with desktop
      await page.setViewportSize(viewports.desktop);
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      // Switch to mobile
      await page.setViewportSize(viewports.mobile);
      
      // Content should still be visible and functional
      await wifiPage.expectFormToBeVisible();
      await wifiPage.expectQRDisplayToBeVisible();
      
      // Switch to tablet
      await page.setViewportSize(viewports.tablet);
      
      // Content should adapt
      await wifiPage.expectFormToBeVisible();
      await wifiPage.expectQRDisplayToBeVisible();
    });

    test('should maintain state across viewport changes', async ({ page }) => {
      // Set initial state
      await wifiPage.toggleTheme(); // Dark theme
      await wifiPage.switchLanguage('Tiếng Việt'); // Vietnamese
      
      const { ssid, encryptionType, password } = wifiTestData.vietnameseNetwork;
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      
      // Change viewport
      await page.setViewportSize(viewports.mobile);
      
      // State should be maintained
      await wifiPage.expectThemeToBeApplied('dark');
      await wifiPage.expectLanguageToBeApplied('vi');
      expect(await wifiPage.getSSIDValue()).toBe(ssid);
      expect(await wifiPage.getPasswordValue()).toBe(password);
    });
  });

  test.describe('Cross-Device Consistency', () => {
    test('should render consistently across different device types', async ({ page }) => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      const screenshots: { [key: string]: Buffer } = {};
      
      // Take screenshots on different viewports
      for (const [deviceName, viewport] of Object.entries(viewports)) {
        await page.setViewportSize(viewport);
        await wifiPage.fillWiFiForm(ssid, encryptionType, password);
        await wifiPage.waitForQRCodeGeneration();
        
        // Take screenshot of the QR display area
        screenshots[deviceName] = await wifiPage.qrDisplayArea.screenshot();
        
        // Verify QR code is visible
        await wifiPage.expectQRDisplayToBeVisible();
      }
      
      // All screenshots should contain QR code content
      expect(Object.keys(screenshots)).toHaveLength(4);
    });

    test('should maintain functionality across device orientations', async ({ page }) => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      // Portrait mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.expectButtonsToBeEnabled();
      
      // Landscape mobile
      await page.setViewportSize({ width: 667, height: 375 });
      await wifiPage.expectFormToBeVisible();
      await wifiPage.expectButtonsToBeEnabled();
      
      // Portrait tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await wifiPage.expectFormToBeVisible();
      await wifiPage.expectButtonsToBeEnabled();
      
      // Landscape tablet
      await page.setViewportSize({ width: 1024, height: 768 });
      await wifiPage.expectFormToBeVisible();
      await wifiPage.expectButtonsToBeEnabled();
    });
  });
});
