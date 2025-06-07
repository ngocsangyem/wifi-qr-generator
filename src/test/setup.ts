import { vi, beforeEach } from 'vitest';
import { config } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';

// Mock external dependencies
vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: vi.fn(() => 'data:image/png;base64,mock-image-data'),
    width: 200,
    height: 200,
  })),
}));

vi.mock('qrcode', () => ({
  default: {
    toCanvas: vi.fn(() => Promise.resolve()),
  },
}));

// Mock the composables
vi.mock('@/composables/useTheme', () => ({
  useTheme: vi.fn(() => ({
    theme: { value: 'light' },
    currentTheme: { value: 'light' },
    isDark: { value: false },
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  })),
}));

vi.mock('@/composables/useI18nUtils', () => ({
  useI18nUtils: vi.fn(() => ({
    currentLocale: { value: 'en' },
    availableLocales: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    ],
    changeLocale: vi.fn(),
    t: vi.fn((key: string) => key),
  })),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

// Mock clipboard API
const clipboardMock = {
  writeText: vi.fn(() => Promise.resolve()),
  readText: vi.fn(() => Promise.resolve('mock-text')),
};
vi.stubGlobal('navigator', {
  clipboard: clipboardMock,
  language: 'en-US',
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.print
vi.stubGlobal('print', vi.fn());

// Create i18n instance for testing
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      app: {
        title: 'Wi-Fi QR Generator',
        description: 'Generate QR codes for Wi-Fi networks • Press Ctrl+Shift+T to toggle theme • Press Ctrl+Shift+L to change language',
      },
      form: {
        ssid: {
          label: 'Name',
          fullLabel: 'Wi-Fi Name (SSID)',
          placeholder: 'Enter Wi-Fi name',
        },
        encryption: {
          label: 'Encryption Type',
          placeholder: 'Select encryption type',
          options: {
            wpa: 'WPA/WPA2',
            wep: 'WEP',
            none: 'None',
          },
        },
        password: {
          label: 'Password',
          placeholder: 'Enter password',
        },
      },
      buttons: {
        saveImage: 'Save as Image',
        print: 'Print',
        copyPassword: 'Copy password',
      },
      qr: {
        title: 'Connect to Wi-Fi',
      },
      theme: {
        switchToLight: 'Switch to light mode',
        switchToDark: 'Switch to dark mode',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      },
      language: {
        label: 'Language',
        english: 'English',
        vietnamese: 'Vietnamese',
      },
    },
    vi: {
      app: {
        title: 'Tạo Mã QR Wi-Fi',
        description: 'Tạo mã QR cho mạng Wi-Fi • Nhấn Ctrl+Shift+T để chuyển đổi giao diện • Nhấn Ctrl+Shift+L để đổi ngôn ngữ',
      },
      form: {
        ssid: {
          label: 'Tên',
          fullLabel: 'Tên Wi-Fi (SSID)',
          placeholder: 'Nhập tên Wi-Fi',
        },
        encryption: {
          label: 'Loại Mã Hóa',
          placeholder: 'Chọn loại mã hóa',
          options: {
            wpa: 'WPA/WPA2',
            wep: 'WEP',
            none: 'Không',
          },
        },
        password: {
          label: 'Mật Khẩu',
          placeholder: 'Nhập mật khẩu',
        },
      },
      buttons: {
        saveImage: 'Lưu Hình Ảnh',
        print: 'In',
        copyPassword: 'Sao chép mật khẩu',
      },
      qr: {
        title: 'Kết Nối Wi-Fi',
      },
      theme: {
        switchToLight: 'Chuyển sang giao diện sáng',
        switchToDark: 'Chuyển sang giao diện tối',
        light: 'Sáng',
        dark: 'Tối',
        system: 'Hệ Thống',
      },
      language: {
        label: 'Ngôn Ngữ',
        english: 'Tiếng Anh',
        vietnamese: 'Tiếng Việt',
      },
    },
  },
});

// Configure Vue Test Utils global plugins
config.global.plugins = [i18n];

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
});
