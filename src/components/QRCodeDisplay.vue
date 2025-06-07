<template>
  <div class="w-full max-w-md">
    <Card
      id="printable-area"
      class="p-6 space-y-4 print:p-8 print:shadow-none print:border-none print:bg-white print:flex print:flex-col print:justify-center"
    >
      <div class="text-center print:flex print:flex-col print:items-center print:justify-center">
        <!-- Screen-only title -->
        <h2 class="text-xl font-semibold mb-4 print:hidden">{{ $t('qr.title') }}</h2>

        <!-- Print/Export Layout -->
        <div class="space-y-4 print:space-y-6 print:text-center print:max-w-sm print:mx-auto">
          <!-- Network Information -->
          <div class="space-y-3 print:space-y-4">
            <!-- SSID with Label -->
            <div class="text-center">
              <p class="text-lg font-medium print:text-xl print:font-semibold print:text-black print:leading-relaxed">
                <span class="print:inline">{{ $t('form.ssid.label') }}: </span>{{ qrData.ssid }}
              </p>
            </div>

            <!-- Password with Label and Copy Button -->
            <div v-if="qrData.password" class="text-center">
              <div class="flex items-center justify-center gap-2 print:block">
                <p class="text-sm text-muted-foreground print:text-lg print:font-medium print:text-black print:mb-0 print:leading-relaxed">
                  <span class="print:inline">{{ $t('form.password.label') }}: </span>{{ qrData.password }}
                </p>
                <Button
                  @click="copyPassword"
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0 print:hidden"
                  :title="$t('buttons.copyPassword')"
                >
                  <CopyIcon class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <!-- QR Code -->
          <div class="flex justify-center print:mt-8 print:flex print:justify-center">
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 print:p-0 print:shadow-none print:border-none print:flex print:justify-center">
              <canvas
                ref="qrCanvas"
                class="max-w-full h-auto print:mx-auto print:block"
              ></canvas>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { CopyIcon } from 'lucide-vue-next'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { QRCodeData } from '@/types'

interface Props {
  qrData: QRCodeData
}

const props = defineProps<Props>()

const qrCanvas = ref<HTMLCanvasElement>()

// Generate QR code when data changes
watch(
  () => props.qrData.qrString,
  async (newQrString) => {
    if (newQrString && qrCanvas.value) {
      await nextTick()
      try {
        await QRCode.toCanvas(qrCanvas.value, newQrString, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }
  },
  { immediate: true }
)

const copyPassword = async () => {
  if (props.qrData.password) {
    try {
      await navigator.clipboard.writeText(props.qrData.password)
      console.log('Password copied to clipboard')
      // You could add a toast notification here with $t('messages.passwordCopied')
    } catch (error) {
      console.error('Failed to copy password:', error)
    }
  }
}
</script>
