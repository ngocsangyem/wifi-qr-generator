<template>
  <!-- Simple Theme Toggle Button -->
  <Button
    @click="toggleTheme"
    variant="outline"
    size="icon"
    class="transition-all duration-200 hover:scale-105"
    :title="isDark ? $t('theme.switchToLight') : $t('theme.switchToDark')"
    :aria-label="isDark ? $t('theme.switchToLight') : $t('theme.switchToDark')"
  >
    <Transition name="icon-fade" mode="out-in">
      <SunIcon v-if="isDark" key="sun" class="h-4 w-4" aria-hidden="true" />
      <MoonIcon v-else key="moon" class="h-4 w-4" aria-hidden="true" />
    </Transition>
  </Button>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/composables/useTheme'

const { toggleTheme, isDark } = useTheme()
</script>

<style scoped>
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.15s ease;
}

.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
}
</style>
