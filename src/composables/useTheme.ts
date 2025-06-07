import { ref, computed, watch, onMounted } from 'vue'
import type { Theme } from '@/types'

const STORAGE_KEY = 'theme-preference'

// Reactive theme state
const theme = ref<Theme>('system')

// Computed current theme (resolves 'system' to actual theme)
const currentTheme = computed(() => {
  if (theme.value === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme.value
})

// Apply theme to document
const applyTheme = (newTheme: 'light' | 'dark') => {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(newTheme)
}

// Set theme and persist to localStorage
const setTheme = (newTheme: Theme) => {
  theme.value = newTheme
  localStorage.setItem(STORAGE_KEY, newTheme)
  applyTheme(currentTheme.value)
}

// Toggle between light and dark (skips system)
const toggleTheme = () => {
  if (theme.value === 'light') {
    setTheme('dark')
  } else if (theme.value === 'dark') {
    setTheme('light')
  } else {
    // If system, toggle to opposite of current system preference
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(systemIsDark ? 'light' : 'dark')
  }
}

// Initialize theme from localStorage or system preference
const initializeTheme = () => {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored && ['light', 'dark', 'system'].includes(stored)) {
    theme.value = stored
  } else {
    theme.value = 'system'
  }
  applyTheme(currentTheme.value)
}

// Watch for system theme changes when using 'system'
const watchSystemTheme = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = () => {
    if (theme.value === 'system') {
      applyTheme(currentTheme.value)
    }
  }
  
  mediaQuery.addEventListener('change', handleChange)
  return () => mediaQuery.removeEventListener('change', handleChange)
}

export function useTheme() {
  // Initialize theme immediately instead of waiting for onMounted
  // This ensures tests can access the correct theme state
  initializeTheme()
  const cleanup = watchSystemTheme()
  
  onMounted(() => {
    // Return cleanup function for unmount
    return cleanup
  })

  // Watch theme changes and apply them
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    theme,  // Return the ref directly instead of computed to allow direct access in tests
    currentTheme,
    setTheme,
    toggleTheme,
    isDark: computed(() => currentTheme.value === 'dark')
  }
}
