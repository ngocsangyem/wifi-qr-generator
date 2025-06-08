import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setLocale, i18n } from '@/locales';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock document.documentElement
Object.defineProperty(document, 'documentElement', {
  value: {
    lang: '',
  },
  writable: true,
});

describe('useI18nUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.documentElement.lang = '';
  });

  describe('changeLocale', () => {
    it('changes locale to English and updates i18n', () => {
      // Test the setLocale function directly instead of the composable
      setLocale('en');

      expect(i18n.global.locale.value).toBe('en');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('language-preference', 'en');
      expect(document.documentElement.lang).toBe('en');
    });

    it('changes locale to Vietnamese and updates i18n', () => {
      // Test the setLocale function directly instead of the composable
      setLocale('vi');

      expect(i18n.global.locale.value).toBe('vi');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('language-preference', 'vi');
      expect(document.documentElement.lang).toBe('vi');
    });
  });

  describe('currentLocale', () => {
    it('returns the current locale from i18n', () => {
      // Test the i18n global locale directly
      expect(['en', 'vi']).toContain(i18n.global.locale.value);
    });
  });
});

describe('setLocale', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.documentElement.lang = '';
  });

  it('sets the locale and persists to localStorage', () => {
    setLocale('vi');
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('language-preference', 'vi');
    expect(document.documentElement.lang).toBe('vi');
  });

  it('updates the i18n global locale', () => {
    setLocale('en');

    // Check that the i18n locale was updated
    expect(i18n.global.locale.value).toBe('en');
  });
});
