<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import WifiForm from './components/WifiForm.vue'
import QRCodeDisplay from './components/QRCodeDisplay.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import LanguageToggle from './components/LanguageToggle.vue'
import { useTheme } from './composables/useTheme'
import { useI18nUtils } from './composables/useI18nUtils'
import { captureElementAsImage, generateQRCodeFilename } from './utils/export'
import type { WifiCredentials, QRCodeData } from './types'

// Initialize theme and i18n
const { isDark, toggleTheme } = useTheme()
const { currentLocale, availableLocales, changeLocale } = useI18nUtils()

// Reactive state
const credentials = ref<WifiCredentials>({
  ssid: '',
  encryptionType: 'WPA/WPA2',
  password: ''
})

// Computed QR data
const qrData = computed<QRCodeData>(() => {
  const { ssid, encryptionType, password } = credentials.value

  // Map encryption types to QR format
  const encryptionMap = {
    'WPA/WPA2': 'WPA',
    'WEP': 'WEP',
    'None': 'nopass'
  }

  const mappedEncryption = encryptionMap[encryptionType]
  const qrString = `WIFI:S:${ssid};T:${mappedEncryption};P:${password};;`

  return {
    ssid,
    encryptionType: mappedEncryption,
    password,
    qrString: ssid ? qrString : ''
  }
})

// Event handlers
const handleSaveAsImage = async () => {
  try {
    const filename = generateQRCodeFilename(credentials.value.ssid)
    await captureElementAsImage('printable-area', filename, {
      hideClasses: ['print:hidden'],
      backgroundColor: '#ffffff',
      scale: 2
    })
  } catch (error) {
    console.error('Error saving image:', error)
  }
}

const handlePrint = () => {
  window.print()
}

const updateCredentials = (newCredentials: WifiCredentials) => {
  credentials.value = newCredentials
}

const handleLanguageChange = (locale: string) => {
  console.log('Language changed to:', locale)
}

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  // Theme toggle: Ctrl/Cmd + Shift + T
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
    event.preventDefault()
    toggleTheme()
  }

  // Language toggle: Ctrl/Cmd + Shift + L
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'L') {
    event.preventDefault()
    const currentIndex = availableLocales.findIndex(l => l.code === currentLocale.value)
    const nextIndex = (currentIndex + 1) % availableLocales.length
    changeLocale(availableLocales[nextIndex].code)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Header with Theme and Language Toggle -->
    <header class="border-b border-border">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">{{ $t('app.title') }}</h1>
          <p class="text-sm text-muted-foreground mt-1">
            {{ $t('app.description') }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <LanguageToggle @language-changed="handleLanguageChange" />
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8 items-start justify-center">
        <!-- Form Section -->
        <WifiForm
          :credentials="credentials"
          @update:credentials="updateCredentials"
          @save-as-image="handleSaveAsImage"
          @print="handlePrint"
        />

        <!-- QR Code Display Section -->
        <QRCodeDisplay
          v-if="credentials.ssid"
          :qr-data="qrData"
        />
      </div>
    </div>
  </div>
</template>
