<template>
  <div class="flex items-center gap-2">
    <!-- Language Selector -->
    <Select :model-value="currentLocale" @update:model-value="handleLanguageChange">
      <SelectTrigger class="w-24 h-10">
        <SelectValue>
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium">{{ getLanguageCode(currentLocale) }}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="lang in availableLocales"
          :key="lang.code"
          :value="lang.code"
          class="flex items-center gap-2"
        >
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium">{{ lang.flag }}</span>
            <span>{{ lang.name }}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18nUtils } from '@/composables/useI18nUtils';
import type { Locale } from '@/locales';
import type { AcceptableValue } from 'reka-ui';

type Emits = {
  'language-changed': [locale: Locale];
};

const emit = defineEmits<Emits>();

const { currentLocale, availableLocales, changeLocale, t } = useI18nUtils();

const getLanguageCode = (locale: Locale): string => {
  const codes = {
    en: 'EN',
    vi: 'VI'
  };
  return codes[locale];
};

const handleLanguageChange = (newLocale: AcceptableValue): void => {
  // Only accept string values for locale
  if (!newLocale || typeof newLocale !== 'string') return;

  // Type guard to ensure the locale is valid
  const isValidLocale = (value: string): value is Locale => {
    return ['en', 'vi'].includes(value);
  };

  if (!isValidLocale(newLocale)) {
    console.warn(`Invalid locale: ${newLocale}`);
    return;
  }

  changeLocale(newLocale);
  emit('language-changed', newLocale);
};
</script>
