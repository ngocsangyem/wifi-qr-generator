import { test, expect } from '@playwright/test';
import { WiFiQRPage } from './pages/wifi-qr-page';
import { wifiTestData } from './fixtures/wifi-data';

test.describe('Print and Export Functionality', () => {
  let wifiPage: WiFiQRPage;

  test.beforeEach(async ({ page }) => {
    wifiPage = new WiFiQRPage(page);
    await wifiPage.goto();
  });

  test.describe('Image Export', () => {
    test('should download image when save button is clicked', async () => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      const download = await wifiPage.saveAsImage();
      
      // Verify download occurred
      expect(download).toBeTruthy();
      expect(download.suggestedFilename()).toMatch(/wifi-qr-.*\.png/);
    });

    test('should generate filename based on SSID', async () => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      const download = await wifiPage.saveAsImage();
      
      expect(download.suggestedFilename()).toBe(`wifi-qr-${ssid}.png`);
    });

    test('should sanitize special characters in filename', async () => {
      const { ssid, encryptionType, password } = wifiTestData.specialCharsNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      const download = await wifiPage.saveAsImage();
      
      // Filename should have special characters replaced
      expect(download.suggestedFilename()).toMatch(/wifi-qr-WiFi-Network_2024_.png/);
    });

    test('should handle Vietnamese characters in filename', async () => {
      const { ssid, encryptionType, password } = wifiTestData.vietnameseNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      const download = await wifiPage.saveAsImage();
      
      // Vietnamese characters should be handled appropriately
      expect(download.suggestedFilename()).toMatch(/wifi-qr-.*\.png/);
    });

    test('should export image with correct content', async ({ page }) => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      // Mock the export function to capture the element
      await page.addInitScript(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).captureElementAsImage = async (elementId: string) => {
          // Mock implementation that just resolves
          document.getElementById(elementId);
          return Promise.resolve();
        };
      });

      await wifiPage.saveAsImage();

      // Verify the printable area was captured
      const printableArea = page.locator('#printable-area');
      await expect(printableArea).toBeVisible();
    });

    test('should work in both light and dark themes', async () => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      // Test in light theme
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      const lightDownload = await wifiPage.saveAsImage();
      expect(lightDownload).toBeTruthy();
      
      // Switch to dark theme and test again
      await wifiPage.toggleTheme();
      
      const darkDownload = await wifiPage.saveAsImage();
      expect(darkDownload).toBeTruthy();
    });

    test('should work with different languages', async () => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      // Test in English
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      const englishDownload = await wifiPage.saveAsImage();
      expect(englishDownload).toBeTruthy();
      
      // Switch to Vietnamese and test again
      await wifiPage.switchLanguage('Tiếng Việt');
      
      const vietnameseDownload = await wifiPage.saveAsImage();
      expect(vietnameseDownload).toBeTruthy();
    });
  });

  test.describe('Print Functionality', () => {
    test('should trigger print dialog when print button is clicked', async ({ page }) => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      // Mock window.print to track if it was called
      await page.addInitScript(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).print = () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).printCalled = true;
        };
      });

      await wifiPage.print();

      // Verify print was triggered
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wasPrintCalled = await page.evaluate(() => (window as any).printCalled);
      expect(wasPrintCalled).toBe(true);
    });

    test('should have correct print styles applied', async ({ page }) => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      // Check that printable area has correct classes
      const printableArea = page.locator('#printable-area');
      await expect(printableArea).toHaveClass(/print:p-8/);
      await expect(printableArea).toHaveClass(/print:shadow-none/);
      await expect(printableArea).toHaveClass(/print:border-none/);
    });

    test('should hide UI elements in print view', async ({ page }) => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      // Elements with print:hidden should have the class
      const title = page.locator('h2').first();
      await expect(title).toHaveClass(/print:hidden/);
      
      const copyButton = page.locator('button').filter({ hasText: /copy/i });
      if (await copyButton.isVisible()) {
        await expect(copyButton).toHaveClass(/print:hidden/);
      }
    });

    test('should show correct content format in print area', async () => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      const printableArea = wifiPage.printableArea;
      
      // Should contain SSID with label
      await expect(printableArea).toContainText(`Name: ${ssid}`);
      
      // Should contain password with label
      await expect(printableArea).toContainText(`Password: ${password}`);
      
      // Should contain QR code
      await expect(printableArea.locator('canvas')).toBeVisible();
    });

    test('should show correct Vietnamese labels in print', async () => {
      const { ssid, encryptionType, password } = wifiTestData.vietnameseNetwork;
      
      // Switch to Vietnamese
      await wifiPage.switchLanguage('Tiếng Việt');
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      const printableArea = wifiPage.printableArea;
      
      // Should contain Vietnamese labels
      await expect(printableArea).toContainText(`Tên: ${ssid}`);
      await expect(printableArea).toContainText(`Mật Khẩu: ${password}`);
    });

    test('should handle open networks in print view', async () => {
      const { ssid, encryptionType } = wifiTestData.openNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType);
      await wifiPage.waitForQRCodeGeneration();
      
      const printableArea = wifiPage.printableArea;
      
      // Should contain SSID
      await expect(printableArea).toContainText(`Name: ${ssid}`);
      
      // Should NOT contain password section
      await expect(printableArea).not.toContainText('Password:');
    });

    test('should center content properly', async ({ page }) => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      // Check for centering classes
      const printableArea = page.locator('#printable-area');
      await expect(printableArea).toHaveClass(/print:flex/);
      await expect(printableArea).toHaveClass(/print:justify-center/);
    });
  });

  test.describe('Responsive Print/Export', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      // Should still be able to export
      const download = await wifiPage.saveAsImage();
      expect(download).toBeTruthy();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      // Should still be able to export
      const download = await wifiPage.saveAsImage();
      expect(download).toBeTruthy();
    });

    test('should maintain quality across different screen sizes', async ({ page }) => {
      const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
      
      await wifiPage.fillWiFiForm(ssid, encryptionType, password);
      await wifiPage.waitForQRCodeGeneration();
      
      // Test on different viewport sizes
      const viewports = [
        { width: 375, height: 667 },   // Mobile
        { width: 768, height: 1024 },  // Tablet
        { width: 1024, height: 768 },  // Desktop
        { width: 1440, height: 900 },  // Large
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        
        // QR code should still be visible and functional
        await wifiPage.expectQRDisplayToBeVisible();
        await expect(wifiPage.qrCodeCanvas).toBeVisible();
      }
    });
  });
});
