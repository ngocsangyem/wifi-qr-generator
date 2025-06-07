import html2canvas from 'html2canvas'

/**
 * Temporarily hides elements with specific classes during image capture
 */
export async function captureElementAsImage(
  elementId: string,
  filename: string = 'qr-code.png',
  options: {
    hideClasses?: string[]
    backgroundColor?: string
    scale?: number
  } = {}
): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`)
  }

  const {
    hideClasses = ['print:hidden'],
    backgroundColor = '#ffffff',
    scale = 2
  } = options

  // Find all elements to hide
  const elementsToHide: { element: HTMLElement; originalDisplay: string }[] = []
  
  hideClasses.forEach(className => {
    // Handle Tailwind's escaped class names
    const escapedClassName = className.replace(':', '\\:')
    const elements = element.querySelectorAll(`.${escapedClassName}`)
    
    elements.forEach(el => {
      const htmlEl = el as HTMLElement
      elementsToHide.push({
        element: htmlEl,
        originalDisplay: htmlEl.style.display
      })
      htmlEl.style.display = 'none'
    })
  })

  try {
    // Capture the image with proper centering
    const canvas = await html2canvas(element, {
      backgroundColor,
      scale,
      useCORS: true,
      allowTaint: true,
      width: element.scrollWidth,
      height: element.scrollHeight,
      x: 0,
      y: 0
    })

    // Create a new canvas with centered content
    const centeredCanvas = document.createElement('canvas')
    const ctx = centeredCanvas.getContext('2d')

    if (ctx) {
      // Set canvas size with padding for centering
      const padding = 40 * scale
      centeredCanvas.width = canvas.width + (padding * 2)
      centeredCanvas.height = canvas.height + (padding * 2)

      // Fill with white background
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, centeredCanvas.width, centeredCanvas.height)

      // Draw the captured content centered
      const x = (centeredCanvas.width - canvas.width) / 2
      const y = (centeredCanvas.height - canvas.height) / 2
      ctx.drawImage(canvas, x, y)

      // Create download link
      const link = document.createElement('a')
      link.download = filename
      link.href = centeredCanvas.toDataURL('image/png')
      if (typeof link.click === 'function') {
        link.click()
      }
    } else {
      // Fallback to original canvas if context creation fails
      const link = document.createElement('a')
      link.download = filename
      link.href = canvas.toDataURL('image/png')
      if (typeof link.click === 'function') {
        link.click()
      }
    }
  } finally {
    // Restore all hidden elements
    elementsToHide.forEach(({ element, originalDisplay }) => {
      element.style.display = originalDisplay
    })
  }
}

/**
 * Generates a filename for the QR code based on SSID
 */
export function generateQRCodeFilename(ssid: string): string {
  // Sanitize SSID for filename
  const sanitized = ssid
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
  
  return `wifi-qr-${sanitized || 'code'}.png`
}
