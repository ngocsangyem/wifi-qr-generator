import { mount, VueWrapper } from '@vue/test-utils';
import type { Component, ComponentPublicInstance } from 'vue';
import { createI18n } from 'vue-i18n';
import { vi, expect } from 'vitest';
import type { WifiCredentials, EncryptionType } from '@/types';

// Type definitions for test utilities
interface WrapperOptions {
  props?: Record<string, unknown>;
  locale?: 'en' | 'vi';
  global?: Record<string, unknown>;
}

interface MockCanvasContext {
  fillStyle: string;
  fillRect: ReturnType<typeof vi.fn>;
  drawImage: ReturnType<typeof vi.fn>;
  getImageData: ReturnType<typeof vi.fn>;
  putImageData: ReturnType<typeof vi.fn>;
  createImageData: ReturnType<typeof vi.fn>;
  setTransform: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
  restore: ReturnType<typeof vi.fn>;
  scale: ReturnType<typeof vi.fn>;
  translate: ReturnType<typeof vi.fn>;
  rotate: ReturnType<typeof vi.fn>;
  clearRect: ReturnType<typeof vi.fn>;
}

// Test data fixtures
export const mockWifiCredentials: WifiCredentials = {
  ssid: 'TestNetwork',
  encryptionType: 'WPA/WPA2',
  password: 'testpassword123',
};

export const mockWifiCredentialsNoPassword: WifiCredentials = {
  ssid: 'OpenNetwork',
  encryptionType: 'None',
  password: '',
};

export const mockWifiCredentialsVietnamese: WifiCredentials = {
  ssid: 'MạngWiFiViệtNam',
  encryptionType: 'WPA/WPA2',
  password: 'mậtkhẩu123',
};

// Test scenarios for different encryption types
export const encryptionTestCases: Array<{
  type: EncryptionType;
  hasPassword: boolean;
  description: string;
}> = [
  {
    type: 'WPA/WPA2',
    hasPassword: true,
    description: 'WPA/WPA2 encrypted network with password',
  },
  {
    type: 'WEP',
    hasPassword: true,
    description: 'WEP encrypted network with password',
  },
  {
    type: 'None',
    hasPassword: false,
    description: 'Open network without password',
  },
];

// Viewport sizes for responsive testing
export const viewportSizes = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1024, height: 768 },
  large: { width: 1440, height: 900 },
};

// Helper function to create a component wrapper with i18n
export function createWrapper<T extends Component>(
  component: T,
  options: WrapperOptions = {}
): VueWrapper<ComponentPublicInstance & Record<string, unknown>> {
  const { props = {}, locale = 'en', global = {} } = options;

  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages: {
      en: {
        app: { title: 'Wi-Fi QR Generator' },
        form: {
          ssid: { label: 'Name', fullLabel: 'Wi-Fi Name (SSID)', placeholder: 'Enter Wi-Fi name' },
          encryption: { label: 'Encryption Type', placeholder: 'Select encryption type' },
          password: { label: 'Password', placeholder: 'Enter password' },
        },
        buttons: { saveImage: 'Save as Image', print: 'Print', copyPassword: 'Copy password' },
        qr: { title: 'Connect to Wi-Fi' },
        theme: { switchToLight: 'Switch to light mode', switchToDark: 'Switch to dark mode' },
      },
      vi: {
        app: { title: 'Tạo Mã QR Wi-Fi' },
        form: {
          ssid: { label: 'Tên', fullLabel: 'Tên Wi-Fi (SSID)', placeholder: 'Nhập tên Wi-Fi' },
          encryption: { label: 'Loại Mã Hóa', placeholder: 'Chọn loại mã hóa' },
          password: { label: 'Mật Khẩu', placeholder: 'Nhập mật khẩu' },
        },
        buttons: { saveImage: 'Lưu Hình Ảnh', print: 'In', copyPassword: 'Sao chép mật khẩu' },
        qr: { title: 'Kết Nối Wi-Fi' },
        theme: { switchToLight: 'Chuyển sang giao diện sáng', switchToDark: 'Chuyển sang giao diện tối' },
      },
    },
  });

  // Use type assertion for test flexibility while maintaining some type safety
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return mount(component as any, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: props as any,
    global: {
      plugins: [i18n],
      ...global,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as VueWrapper<any>;
}

// Helper to simulate user input
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fillInput(wrapper: VueWrapper<any>, selector: string, value: string): Promise<void> {
  const input = wrapper.find(selector);
  await input.setValue(value);
  await input.trigger('input');
}

// Helper to simulate button clicks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function clickButton(wrapper: VueWrapper<any>, selector: string): Promise<void> {
  const button = wrapper.find(selector);
  await button.trigger('click');
}

// Helper to simulate keyboard events
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function pressKey(wrapper: VueWrapper<any>, key: string, modifiers: string[] = []): Promise<void> {
  const keyboardEvent = new KeyboardEvent('keydown', {
    key,
    ctrlKey: modifiers.includes('ctrl'),
    metaKey: modifiers.includes('meta'),
    shiftKey: modifiers.includes('shift'),
    altKey: modifiers.includes('alt'),
  });

  document.dispatchEvent(keyboardEvent);
  await wrapper.vm.$nextTick();
}

// Helper to wait for async operations
export function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to mock canvas context
export function mockCanvasContext(): void {
  const mockContext: MockCanvasContext = {
    fillStyle: '',
    fillRect: vi.fn(),
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    setTransform: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    clearRect: vi.fn(),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (HTMLCanvasElement.prototype.getContext as any) = vi.fn(() => mockContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (HTMLCanvasElement.prototype.toDataURL as any) = vi.fn(() => 'data:image/png;base64,mock-data');
}

// Helper to assert QR code generation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function expectQRCodeGenerated(wrapper: VueWrapper<any>): void {
  const canvas = wrapper.find('canvas');
  expect(canvas.exists()).toBe(true);
}

// Helper to assert translation keys
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function expectTranslation(wrapper: VueWrapper<any>, text: string): void {
  expect(wrapper.text()).toContain(text);
}
