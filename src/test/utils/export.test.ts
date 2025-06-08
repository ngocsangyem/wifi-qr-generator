/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { captureElementAsImage, generateQRCodeFilename } from '@/utils/export';

// Type definitions for test mocks
interface MockCanvas {
  width: number;
  height: number;
  toDataURL: ReturnType<typeof vi.fn>;
  getContext?: ReturnType<typeof vi.fn>;
}

interface MockLink {
  download: string;
  href: string;
  click: ReturnType<typeof vi.fn>;
}

// Extend global interface for html2canvas
declare global {
  // eslint-disable-next-line no-var
  var html2canvas: ReturnType<typeof vi.fn>;
}

describe('export utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock DOM elements with proper type assertions
     
    document.getElementById = vi.fn() as any;
     
    document.createElement = vi.fn() as any;

    // Mock canvas and context
    const mockCanvas: MockCanvas = {
      width: 200,
      height: 200,
      toDataURL: vi.fn(() => 'data:image/png;base64,mock-data'),
      getContext: vi.fn(() => ({
        fillStyle: '',
        fillRect: vi.fn(),
        drawImage: vi.fn(),
      })),
    };

    const mockLink: MockLink = {
      download: '',
      href: '',
      click: vi.fn(),
    };

     
    (document.createElement as any) = vi.fn((tagName: string) => {
      if (tagName === 'canvas') return mockCanvas;
      if (tagName === 'a') return mockLink;
       
      return {} as any;
    });

    // Mock html2canvas globally
    global.html2canvas = vi.fn();
  });

  describe('generateQRCodeFilename', () => {
    it('generates filename with SSID', () => {
      const filename = generateQRCodeFilename('MyNetwork');
      expect(filename).toBe('wifi-qr-MyNetwork.png');
    });

    it('sanitizes special characters in SSID', () => {
      const filename = generateQRCodeFilename('My Network!@#$%');
      expect(filename).toBe('wifi-qr-My_Network.png');
    });

    it('handles spaces in SSID', () => {
      const filename = generateQRCodeFilename('Home WiFi Network');
      expect(filename).toBe('wifi-qr-Home_WiFi_Network.png');
    });

    it('handles empty SSID', () => {
      const filename = generateQRCodeFilename('');
      expect(filename).toBe('wifi-qr-code.png');
    });

    it('handles SSID with only special characters', () => {
      const filename = generateQRCodeFilename('!@#$%^&*()');
      expect(filename).toBe('wifi-qr-code.png');
    });

    it('handles Vietnamese characters', () => {
      const filename = generateQRCodeFilename('MạngWiFiViệtNam');
      expect(filename).toBe('wifi-qr-M_ngWiFiVi_tNam.png');
    });

    it('removes consecutive underscores', () => {
      const filename = generateQRCodeFilename('Test___Network');
      expect(filename).toBe('wifi-qr-Test_Network.png');
    });

    it('removes leading and trailing underscores', () => {
      const filename = generateQRCodeFilename('_TestNetwork_');
      expect(filename).toBe('wifi-qr-TestNetwork.png');
    });
  });

  describe('captureElementAsImage', () => {
    it('throws error when element not found', async () => {
       
      (document.getElementById as any) = vi.fn(() => null);

      await expect(captureElementAsImage('non-existent')).rejects.toThrow(
        'Element with id "non-existent" not found'
      );
    });

    it('captures element and creates download link', async () => {
      const mockElement = {
        scrollWidth: 400,
        scrollHeight: 300,
        querySelectorAll: vi.fn(() => []),
      } as any;

      const mockCanvas = {
        width: 200,
        height: 200,
        toDataURL: vi.fn(() => 'data:image/png;base64,original-data'),
      } as any;

      const mockCenteredCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(() => ({
          fillStyle: '',
          fillRect: vi.fn(),
          drawImage: vi.fn(),
        })),
        toDataURL: vi.fn(() => 'data:image/png;base64,centered-data'),
      } as any;

      const mockLink = {
        download: '',
        href: '',
        click: vi.fn(),
      } as any;

      (document.getElementById as any) = vi.fn(() => mockElement);
      (document.createElement as any) = vi.fn((tagName: string) => {
        if (tagName === 'a') return mockLink;
        if (tagName === 'canvas') return mockCenteredCanvas;
        return {} as any;
      });

      // Mock html2canvas
      global.html2canvas = vi.fn(() => Promise.resolve(mockCanvas));

      await captureElementAsImage('test-element', 'test.png');

      expect(mockLink.download).toBe('test.png');
      expect(mockLink.href).toBe('data:image/png;base64,centered-data');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('hides elements with specified classes during capture', async () => {
      const mockHiddenElement = {
        style: { display: '' },
      } as any;

      const mockElement = {
        scrollWidth: 400,
        scrollHeight: 300,
        querySelectorAll: vi.fn(() => [mockHiddenElement]),
      } as any;

      const mockCanvas = {
        width: 200,
        height: 200,
        toDataURL: vi.fn(() => 'data:image/png;base64,mock-data'),
      } as any;

      (document.getElementById as any) = vi.fn(() => mockElement);

      // Mock html2canvas
      global.html2canvas = vi.fn(() => Promise.resolve(mockCanvas));

      await captureElementAsImage('test-element', 'test.png', {
        hideClasses: ['print:hidden'],
      });

      // Verify element was hidden and restored
      expect(mockElement.querySelectorAll).toHaveBeenCalledWith('.print\\:hidden');
    });

    it('restores hidden elements even if error occurs', async () => {
      const mockHiddenElement = {
        style: { display: 'block' },
      } as any;

      const mockElement = {
        scrollWidth: 400,
        scrollHeight: 300,
        querySelectorAll: vi.fn(() => [mockHiddenElement]),
      } as any;

      (document.getElementById as any) = vi.fn(() => mockElement);

      // Mock html2canvas to throw error
      global.html2canvas = vi.fn(() => Promise.reject(new Error('Canvas error')));

      // The function should handle the error and restore elements
      try {
        await captureElementAsImage('test-element');
      } catch {
        // Error is expected but elements should still be restored
      }

      // Element should still be restored
      expect(mockHiddenElement.style.display).toBe('block');
    });

    it('uses default options when not provided', async () => {
      const mockElement = {
        scrollWidth: 400,
        scrollHeight: 300,
        querySelectorAll: vi.fn(() => []),
      } as any;

      const mockCanvas = {
        width: 200,
        height: 200,
        toDataURL: vi.fn(() => 'data:image/png;base64,mock-data'),
      } as any;

      const mockContext = {
        fillStyle: '',
        fillRect: vi.fn(),
        drawImage: vi.fn(),
      };

      const mockCenteredCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(() => mockContext),
        toDataURL: vi.fn(() => 'data:image/png;base64,centered-data'),
      } as any;

      const mockLink = {
        download: '',
        href: '',
        click: vi.fn(),
      } as any;

      (document.getElementById as any) = vi.fn(() => mockElement);
      (document.createElement as any) = vi.fn((tagName: string) => {
        if (tagName === 'a') return mockLink;
        if (tagName === 'canvas') return mockCenteredCanvas;
        return {} as any;
      });

      // Mock html2canvas
      global.html2canvas = vi.fn(() => Promise.resolve(mockCanvas));

      // Test that the function completes without error
      await captureElementAsImage('test-element');

      // Check that the link was created and clicked
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toBe('qr-code.png'); // Default filename
      expect(mockLink.href).toContain('data:image/png;base64');
    });

    it('applies custom options', async () => {
      const mockElement = {
        scrollWidth: 400,
        scrollHeight: 300,
        querySelectorAll: vi.fn(() => []),
      } as any;

      const mockCanvas = {
        width: 200,
        height: 200,
        toDataURL: vi.fn(() => 'data:image/png;base64,mock-data'),
      } as any;

      const mockContext = {
        fillStyle: '',
        fillRect: vi.fn(),
        drawImage: vi.fn(),
      };

      const mockCenteredCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(() => mockContext),
        toDataURL: vi.fn(() => 'data:image/png;base64,centered-data'),
      } as any;

      const mockLink = {
        download: '',
        href: '',
        click: vi.fn(),
      } as any;

      (document.getElementById as any) = vi.fn(() => mockElement);
      (document.createElement as any) = vi.fn((tagName: string) => {
        if (tagName === 'a') return mockLink;
        if (tagName === 'canvas') return mockCenteredCanvas;
        return {} as any;
      });

      // Mock html2canvas
      global.html2canvas = vi.fn(() => Promise.resolve(mockCanvas));

      // Test that the function completes without error
      await captureElementAsImage('test-element', 'custom.png', {
        backgroundColor: '#000000',
        scale: 3,
      });

      // Check that the link was created with custom filename
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toBe('custom.png');
      expect(mockLink.href).toContain('data:image/png;base64');
    });

    it('creates centered canvas with proper padding', async () => {
      const mockElement = {
        scrollWidth: 400,
        scrollHeight: 300,
        querySelectorAll: vi.fn(() => []),
      } as any;

      const mockOriginalCanvas = {
        width: 200,
        height: 200,
        toDataURL: vi.fn(() => 'data:image/png;base64,original-data'),
      } as any;

      const mockContext = {
        fillStyle: '',
        fillRect: vi.fn(),
        drawImage: vi.fn(),
      } as any;

      // Create a mock canvas that tracks width/height assignments
      let canvasWidth = 0;
      let canvasHeight = 0;
      const mockCenteredCanvas = {
        get width() { return canvasWidth; },
        set width(value) { canvasWidth = value; },
        get height() { return canvasHeight; },
        set height(value) { canvasHeight = value; },
        getContext: vi.fn(() => mockContext),
        toDataURL: vi.fn(() => 'data:image/png;base64,centered-data'),
      } as any;

      (document.getElementById as any) = vi.fn(() => mockElement);
      (document.createElement as any) = vi.fn(() => mockCenteredCanvas);

      // Mock html2canvas
      global.html2canvas = vi.fn(() => Promise.resolve(mockOriginalCanvas));

      await captureElementAsImage('test-element', 'test.png', { scale: 2 });

      // Check that centered canvas has proper dimensions (original + padding)
      const expectedPadding = 40 * 2; // 40px * scale
      expect(mockCenteredCanvas.width).toBe(200 + expectedPadding * 2); // 200 + 160 = 360
      expect(mockCenteredCanvas.height).toBe(200 + expectedPadding * 2); // 200 + 160 = 360

      // Check that content is drawn centered
      expect(mockContext.drawImage).toHaveBeenCalledTimes(1);
      const drawImageCall = mockContext.drawImage.mock.calls[0];
      expect(drawImageCall[1]).toBe(80); // X position
      expect(drawImageCall[2]).toBe(80); // Y position
    });
  });
});
