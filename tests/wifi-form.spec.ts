import { test, expect } from '@playwright/test';
import { WiFiQRPage } from './pages/wifi-qr-page';
import { wifiTestData, translations } from './fixtures/wifi-data';

test.describe('WiFi Form Functionality', () => {
  let wifiPage: WiFiQRPage;

  test.beforeEach(async ({ page }) => {
    wifiPage = new WiFiQRPage(page);
    await wifiPage.goto();
  });

  test('should display the main form elements', async () => {
    await wifiPage.expectFormToBeVisible();
    await expect(wifiPage.appTitle).toContainText(translations.en.appTitle);
  });

  test('should generate QR code for WPA/WPA2 network', async () => {
    const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
    
    await wifiPage.fillWiFiForm(ssid, encryptionType, password);
    await wifiPage.waitForQRCodeGeneration();
    
    await wifiPage.expectQRDisplayToBeVisible();
    await wifiPage.expectSSIDInDisplay(ssid);
    await wifiPage.expectPasswordInDisplay(password);
    await wifiPage.expectButtonsToBeEnabled();
  });

  test('should generate QR code for open network', async () => {
    const { ssid, encryptionType } = wifiTestData.openNetwork;
    
    await wifiPage.fillWiFiForm(ssid, encryptionType);
    await wifiPage.waitForQRCodeGeneration();
    
    await wifiPage.expectQRDisplayToBeVisible();
    await wifiPage.expectSSIDInDisplay(ssid);
    await wifiPage.expectCopyButtonToBeHidden();
    await wifiPage.expectButtonsToBeEnabled();
  });

  test('should disable password input for open networks', async () => {
    const { ssid, encryptionType } = wifiTestData.openNetwork;
    
    await wifiPage.fillWiFiForm(ssid, encryptionType);
    
    await wifiPage.expectPasswordInputToBeDisabled();
    await wifiPage.expectPasswordToggleToBeHidden();
  });

  test('should enable password input for encrypted networks', async () => {
    const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
    
    await wifiPage.fillWiFiForm(ssid, encryptionType, password);
    
    await wifiPage.expectPasswordInputToBeEnabled();
    await wifiPage.expectPasswordToggleToBeVisible();
  });

  test('should toggle password visibility', async () => {
    const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
    
    await wifiPage.fillWiFiForm(ssid, encryptionType, password);
    
    // Initially password should be hidden
    expect(await wifiPage.getPasswordInputType()).toBe('password');
    
    // Toggle to show password
    await wifiPage.togglePasswordVisibility();
    expect(await wifiPage.getPasswordInputType()).toBe('text');
    
    // Toggle back to hide password
    await wifiPage.togglePasswordVisibility();
    expect(await wifiPage.getPasswordInputType()).toBe('password');
  });

  test('should disable buttons when SSID is empty', async () => {
    await wifiPage.expectButtonsToBeDisabled();
    
    // Fill only password
    await wifiPage.passwordInput.fill('password123');
    await wifiPage.expectButtonsToBeDisabled();
    
    // Fill SSID to enable buttons
    await wifiPage.ssidInput.fill('TestNetwork');
    await wifiPage.expectButtonsToBeEnabled();
  });

  test('should handle special characters in SSID and password', async () => {
    const { ssid, encryptionType, password } = wifiTestData.specialCharsNetwork;
    
    await wifiPage.fillWiFiForm(ssid, encryptionType, password);
    await wifiPage.waitForQRCodeGeneration();
    
    await wifiPage.expectSSIDInDisplay(ssid);
    await wifiPage.expectPasswordInDisplay(password);
  });

  test('should handle Vietnamese characters', async () => {
    const { ssid, encryptionType, password } = wifiTestData.vietnameseNetwork;
    
    await wifiPage.fillWiFiForm(ssid, encryptionType, password);
    await wifiPage.waitForQRCodeGeneration();
    
    await wifiPage.expectSSIDInDisplay(ssid);
    await wifiPage.expectPasswordInDisplay(password);
  });

  test('should handle long SSID and password', async () => {
    const { ssid, encryptionType, password } = wifiTestData.longNetwork;
    
    await wifiPage.fillWiFiForm(ssid, encryptionType, password);
    await wifiPage.waitForQRCodeGeneration();
    
    await wifiPage.expectSSIDInDisplay(ssid);
    await wifiPage.expectPasswordInDisplay(password);
  });

  test('should clear password when switching to open network', async () => {
    // Start with encrypted network
    await wifiPage.fillWiFiForm('TestNetwork', 'WPA/WPA2', 'password123');
    expect(await wifiPage.getPasswordValue()).toBe('password123');
    
    // Switch to open network
    await wifiPage.encryptionSelect.click();
    await wifiPage.page.getByText('None', { exact: true }).click();
    
    // Password should be cleared and input disabled
    expect(await wifiPage.getPasswordValue()).toBe('');
    await wifiPage.expectPasswordInputToBeDisabled();
  });

  test('should maintain form state when switching encryption types', async () => {
    const ssid = 'TestNetwork';
    
    // Fill SSID
    await wifiPage.ssidInput.fill(ssid);
    
    // Switch between encryption types
    await wifiPage.encryptionSelect.click();
    await wifiPage.page.getByText('WEP', { exact: true }).click();
    
    await wifiPage.passwordInput.fill('weppassword');
    
    // SSID should be maintained
    expect(await wifiPage.getSSIDValue()).toBe(ssid);
    expect(await wifiPage.getPasswordValue()).toBe('weppassword');
  });

  test('should copy password to clipboard', async ({ context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const { ssid, encryptionType, password } = wifiTestData.wpaNetwork;
    
    await wifiPage.fillWiFiForm(ssid, encryptionType, password);
    await wifiPage.waitForQRCodeGeneration();
    
    await wifiPage.copyPassword();
    
    // Verify clipboard content
    const clipboardText = await wifiPage.page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(password);
  });

  test('should update QR code when form values change', async () => {
    // Initial network
    await wifiPage.fillWiFiForm('Network1', 'WPA/WPA2', 'password1');
    await wifiPage.waitForQRCodeGeneration();
    
    // Change SSID
    await wifiPage.ssidInput.fill('Network2');
    await wifiPage.expectSSIDInDisplay('Network2');
    
    // Change password
    await wifiPage.passwordInput.fill('password2');
    await wifiPage.expectPasswordInDisplay('password2');
  });

  test('should validate all encryption types', async () => {
    const ssid = 'TestNetwork';
    const password = 'testpassword';
    
    // Test WPA/WPA2
    await wifiPage.fillWiFiForm(ssid, 'WPA/WPA2', password);
    await wifiPage.expectPasswordInputToBeEnabled();
    await wifiPage.expectCopyButtonToBeVisible();
    
    // Test WEP
    await wifiPage.encryptionSelect.click();
    await wifiPage.page.getByText('WEP', { exact: true }).click();
    await wifiPage.expectPasswordInputToBeEnabled();
    
    // Test None
    await wifiPage.encryptionSelect.click();
    await wifiPage.page.getByText('None', { exact: true }).click();
    await wifiPage.expectPasswordInputToBeDisabled();
    await wifiPage.expectCopyButtonToBeHidden();
  });
});
