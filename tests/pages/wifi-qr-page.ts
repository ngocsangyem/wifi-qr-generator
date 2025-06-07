import { Page, Locator, expect } from '@playwright/test';
import type { EncryptionType } from '../../src/types';

export class WiFiQRPage {
  readonly page: Page;
  readonly appTitle: Locator;
  readonly ssidInput: Locator;
  readonly encryptionSelect: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggleButton: Locator;
  readonly saveImageButton: Locator;
  readonly printButton: Locator;
  readonly qrCodeCanvas: Locator;
  readonly qrDisplayArea: Locator;
  readonly printableArea: Locator;
  readonly themeToggleButton: Locator;
  readonly languageSelector: Locator;
  readonly copyPasswordButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appTitle = page.getByRole('heading', { level: 1 });
    this.ssidInput = page.locator('#ssid');
    this.encryptionSelect = page.locator('select, [role="combobox"]').first();
    this.passwordInput = page.locator('#password');
    this.passwordToggleButton = page.locator('button[type="button"]').filter({ hasText: /eye/i });
    this.saveImageButton = page.getByRole('button').filter({ hasText: /save.*image/i });
    this.printButton = page.getByRole('button').filter({ hasText: /print/i });
    this.qrCodeCanvas = page.locator('canvas');
    this.qrDisplayArea = page.locator('#printable-area');
    this.printableArea = page.locator('#printable-area');
    this.themeToggleButton = page.locator('button[aria-label*="Switch to"]');
    this.languageSelector = page.locator('[role="combobox"]').last();
    this.copyPasswordButton = page.getByRole('button').filter({ hasText: /copy/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async fillWiFiForm(ssid: string, encryptionType: EncryptionType, password?: string) {
    // Fill SSID
    await this.ssidInput.fill(ssid);

    // Select encryption type
    await this.encryptionSelect.click();
    await this.page.getByText(encryptionType, { exact: true }).click();

    // Fill password if provided and encryption is not None
    if (password && encryptionType !== 'None') {
      await this.passwordInput.fill(password);
    }
  }

  async togglePasswordVisibility() {
    await this.passwordToggleButton.click();
  }

  async saveAsImage() {
    // Set up download promise before clicking
    const downloadPromise = this.page.waitForEvent('download');
    await this.saveImageButton.click();
    return downloadPromise;
  }

  async print() {
    // Mock print dialog
    await this.page.evaluate(() => {
      window.print = () => console.log('Print dialog opened');
    });
    await this.printButton.click();
  }

  async toggleTheme() {
    await this.themeToggleButton.click();
  }

  async switchLanguage(language: 'English' | 'Tiếng Việt') {
    await this.languageSelector.click();
    await this.page.getByText(language).click();
  }

  async copyPassword() {
    await this.copyPasswordButton.click();
  }

  async pressKeyboardShortcut(shortcut: 'theme' | 'language') {
    const modifiers = ['Control', 'Shift'];
    const key = shortcut === 'theme' ? 'T' : 'L';
    
    await this.page.keyboard.press(`${modifiers.join('+')}+${key}`);
  }

  async waitForQRCodeGeneration() {
    await expect(this.qrCodeCanvas).toBeVisible();
    // Wait for canvas to be populated
    await this.page.waitForFunction(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return false;
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return imageData.data.some(pixel => pixel !== 0);
    });
  }

  async expectFormToBeVisible() {
    await expect(this.ssidInput).toBeVisible();
    await expect(this.encryptionSelect).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.saveImageButton).toBeVisible();
    await expect(this.printButton).toBeVisible();
  }

  async expectQRDisplayToBeVisible() {
    await expect(this.qrDisplayArea).toBeVisible();
    await expect(this.qrCodeCanvas).toBeVisible();
  }

  async expectButtonsToBeDisabled() {
    await expect(this.saveImageButton).toBeDisabled();
    await expect(this.printButton).toBeDisabled();
  }

  async expectButtonsToBeEnabled() {
    await expect(this.saveImageButton).toBeEnabled();
    await expect(this.printButton).toBeEnabled();
  }

  async expectPasswordInputToBeDisabled() {
    await expect(this.passwordInput).toBeDisabled();
  }

  async expectPasswordInputToBeEnabled() {
    await expect(this.passwordInput).toBeEnabled();
  }

  async expectPasswordToggleToBeVisible() {
    await expect(this.passwordToggleButton).toBeVisible();
  }

  async expectPasswordToggleToBeHidden() {
    await expect(this.passwordToggleButton).not.toBeVisible();
  }

  async expectThemeToBeApplied(theme: 'light' | 'dark') {
    const htmlElement = this.page.locator('html');
    await expect(htmlElement).toHaveClass(new RegExp(theme));
  }

  async expectLanguageToBeApplied(language: 'en' | 'vi') {
    const htmlElement = this.page.locator('html');
    await expect(htmlElement).toHaveAttribute('lang', language);
  }

  async expectTranslation(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async expectSSIDInDisplay(ssid: string) {
    await expect(this.qrDisplayArea.getByText(ssid)).toBeVisible();
  }

  async expectPasswordInDisplay(password: string) {
    await expect(this.qrDisplayArea.getByText(password)).toBeVisible();
  }

  async expectCopyButtonToBeVisible() {
    await expect(this.copyPasswordButton).toBeVisible();
  }

  async expectCopyButtonToBeHidden() {
    await expect(this.copyPasswordButton).not.toBeVisible();
  }

  async getPasswordInputType(): Promise<string> {
    return await this.passwordInput.getAttribute('type') || 'text';
  }

  async getSSIDValue(): Promise<string> {
    return await this.ssidInput.inputValue();
  }

  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  async getSelectedEncryption(): Promise<string> {
    // For select elements
    if (await this.encryptionSelect.evaluate(el => el.tagName === 'SELECT')) {
      return await this.encryptionSelect.inputValue();
    }
    // For custom select components
    return await this.encryptionSelect.textContent() || '';
  }

  async isQRCodeVisible(): Promise<boolean> {
    return await this.qrCodeCanvas.isVisible();
  }

  async isDarkTheme(): Promise<boolean> {
    const htmlClass = await this.page.locator('html').getAttribute('class');
    return htmlClass?.includes('dark') || false;
  }

  async getCurrentLanguage(): Promise<string> {
    return await this.page.locator('html').getAttribute('lang') || 'en';
  }

  async setViewportSize(width: number, height: number) {
    await this.page.setViewportSize({ width, height });
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  }
}
