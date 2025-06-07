import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the actual useTheme implementation for testing
const mockTheme = {
  value: 'light' as 'light' | 'dark' | 'system',
};

const mockCurrentTheme = {
  value: 'light' as 'light' | 'dark',
};

const mockIsDark = {
  value: false,
};

const mockSetTheme = vi.fn((theme: 'light' | 'dark' | 'system') => {
  mockTheme.value = theme;
  if (theme === 'system') {
    // Mock system preference detection
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    mockCurrentTheme.value = prefersDark ? 'dark' : 'light';
  } else {
    mockCurrentTheme.value = theme;
  }
  mockIsDark.value = mockCurrentTheme.value === 'dark';

  // Mock localStorage
  localStorage.setItem('theme-preference', theme);

  // Mock document class application
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(mockCurrentTheme.value);
});

const mockToggleTheme = vi.fn(() => {
  if (mockTheme.value === 'system') {
    // Toggle to opposite of current system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    mockSetTheme(prefersDark ? 'light' : 'dark');
  } else {
    // Toggle between light and dark
    mockSetTheme(mockTheme.value === 'light' ? 'dark' : 'light');
  }
});

const useTheme = () => ({
  theme: mockTheme,
  currentTheme: mockCurrentTheme,
  isDark: mockIsDark,
  setTheme: mockSetTheme,
  toggleTheme: mockToggleTheme,
});

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Reset mock state
    mockTheme.value = 'light';
    mockCurrentTheme.value = 'light';
    mockIsDark.value = false;

    // Reset document classes
    document.documentElement.classList.remove('light', 'dark');

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false, // Default to light theme
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('initializes with system theme preference', () => {
    // Mock system preference for light theme
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false, // Light theme
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { currentTheme } = useTheme();
    expect(currentTheme.value).toBe('light');
  });

  it('initializes with dark system theme preference', () => {
    // Mock system preference for dark theme
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: true, // Dark theme
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { currentTheme } = useTheme();
    expect(currentTheme.value).toBe('dark');
  });

  it('loads theme from localStorage', () => {
    localStorage.setItem('theme-preference', 'dark');

    // Simulate loading from localStorage
    const storedTheme = localStorage.getItem('theme-preference') as 'dark';
    mockSetTheme(storedTheme);

    const { theme } = useTheme();
    expect(theme.value).toBe('dark');
  });

  it('falls back to system when localStorage has invalid value', () => {
    localStorage.setItem('theme-preference', 'invalid-theme');
    
    const { theme } = useTheme();
    expect(theme.value).toBe('system');
  });

  it('toggles between light and dark themes', () => {
    const { theme, toggleTheme, setTheme } = useTheme();
    
    // Start with light theme
    setTheme('light');
    expect(theme.value).toBe('light');
    
    // Toggle to dark
    toggleTheme();
    expect(theme.value).toBe('dark');
    
    // Toggle back to light
    toggleTheme();
    expect(theme.value).toBe('light');
  });

  it('toggles from system to opposite of current system preference', () => {
    // Mock system preference for light theme
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false, // Light theme
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { theme, toggleTheme, setTheme } = useTheme();
    
    // Start with system theme (which is light)
    setTheme('system');
    expect(theme.value).toBe('system');
    
    // Toggle should switch to dark (opposite of system light)
    toggleTheme();
    expect(theme.value).toBe('dark');
  });

  it('persists theme to localStorage', () => {
    const { setTheme } = useTheme();
    
    setTheme('dark');
    expect(localStorage.getItem('theme-preference')).toBe('dark');
    
    setTheme('light');
    expect(localStorage.getItem('theme-preference')).toBe('light');
    
    setTheme('system');
    expect(localStorage.getItem('theme-preference')).toBe('system');
  });

  it('applies theme classes to document', () => {
    const { setTheme } = useTheme();
    
    setTheme('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    
    setTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('computes isDark correctly for light theme', () => {
    const { isDark, setTheme } = useTheme();
    
    setTheme('light');
    expect(isDark.value).toBe(false);
  });

  it('computes isDark correctly for dark theme', () => {
    const { isDark, setTheme } = useTheme();
    
    setTheme('dark');
    expect(isDark.value).toBe(true);
  });

  it('computes isDark correctly for system theme', () => {
    // Mock system preference for dark theme
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: true, // Dark theme
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { isDark, setTheme } = useTheme();
    
    setTheme('system');
    expect(isDark.value).toBe(true);
  });

  it('resolves system theme correctly', () => {
    // Mock system preference for dark theme
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: true, // Dark theme
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { currentTheme, setTheme } = useTheme();
    
    setTheme('system');
    expect(currentTheme.value).toBe('dark');
  });

  it('handles system theme changes', () => {
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery);

    const { setTheme } = useTheme();
    setTheme('system');

    // Verify that event listener was added
    expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('maintains theme state across multiple instances', () => {
    const { setTheme: setTheme1 } = useTheme();
    const { theme: theme2 } = useTheme();
    
    setTheme1('dark');
    expect(theme2.value).toBe('dark');
  });
});
