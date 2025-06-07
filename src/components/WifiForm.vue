<template>
  <div class="w-full max-w-md">
    <Card class="p-6">
      <div class="space-y-6">
        <!-- SSID Input -->
        <div class="space-y-2">
          <Label for="ssid">{{ $t('form.ssid.fullLabel') }}</Label>
          <Input
            id="ssid"
            :model-value="credentials.ssid"
            @update:model-value="(value) => updateSsid(String(value))"
            type="text"
            :placeholder="$t('form.ssid.placeholder')"
          />
        </div>

        <!-- Encryption Type Select -->
        <div class="space-y-2">
          <Label for="encryption">{{ $t('form.encryption.label') }}</Label>
          <Select :model-value="credentials.encryptionType" @update:model-value="(value) => updateEncryptionType(String(value))">
            <SelectTrigger id="encryption">
              <SelectValue :placeholder="$t('form.encryption.placeholder')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WPA/WPA2">{{ $t('form.encryption.options.wpa') }}</SelectItem>
              <SelectItem value="WEP">{{ $t('form.encryption.options.wep') }}</SelectItem>
              <SelectItem value="None">{{ $t('form.encryption.options.none') }}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Password Input -->
        <div class="space-y-2">
          <Label for="password">{{ $t('form.password.label') }}</Label>
          <div class="relative">
            <Input
              id="password"
              :model-value="credentials.password"
              @update:model-value="(value) => updatePassword(String(value))"
              :type="showPassword ? 'text' : 'password'"
              :disabled="credentials.encryptionType === 'None'"
              :placeholder="$t('form.password.placeholder')"
              class="pr-10"
            />
            <Button
              v-if="credentials.encryptionType !== 'None'"
              @click="togglePasswordVisibility"
              type="button"
              variant="ghost"
              size="sm"
              class="absolute inset-y-0 right-0 h-full px-3 py-2 hover:bg-transparent"
            >
              <EyeIcon v-if="!showPassword" class="h-4 w-4" />
              <EyeOffIcon v-else class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <Button
            @click="saveAsImage"
            :disabled="!credentials.ssid"
            class="w-full"
          >
            {{ $t('buttons.saveImage') }}
          </Button>
          <Button
            @click="printQR"
            :disabled="!credentials.ssid"
            variant="outline"
            class="w-full"
          >
            {{ $t('buttons.print') }}
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { WifiCredentials } from '@/types'

interface Props {
  credentials: WifiCredentials
}

interface Emits {
  (e: 'update:credentials', value: WifiCredentials): void
  (e: 'save-as-image'): void
  (e: 'print'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showPassword = ref(false)

// Update methods
const updateSsid = (value: string) => {
  const updatedCredentials = { ...props.credentials, ssid: value }
  emit('update:credentials', updatedCredentials)
}

const updateEncryptionType = (value: string) => {
  const newType = value as WifiCredentials['encryptionType']
  const updatedCredentials = {
    ...props.credentials,
    encryptionType: newType,
    password: newType === 'None' ? '' : props.credentials.password
  }
  emit('update:credentials', updatedCredentials)
}

const updatePassword = (value: string) => {
  const updatedCredentials = { ...props.credentials, password: value }
  emit('update:credentials', updatedCredentials)
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const saveAsImage = () => {
  emit('save-as-image')
}

const printQR = () => {
  emit('print')
}
</script>
