import { describe, it, expect, beforeEach } from 'vitest';
import QRCodeDisplay from '@/components/QRCodeDisplay.vue';
import { createWrapper, mockCanvasContext, expectQRCodeGenerated } from '../utils';
import type { QRCodeData } from '@/types';

describe('QRCodeDisplay', () => {
  const mockQRData: QRCodeData = {
    ssid: 'TestNetwork',
    encryptionType: 'WPA',
    password: 'testpassword123',
    qrString: 'WIFI:S:TestNetwork;T:WPA;P:testpassword123;;',
  };

  const mockQRDataNoPassword: QRCodeData = {
    ssid: 'OpenNetwork',
    encryptionType: 'nopass',
    password: '',
    qrString: 'WIFI:S:OpenNetwork;T:nopass;P:;;',
  };

  beforeEach(() => {
    mockCanvasContext();
  });

  it('renders QR code display correctly', () => {
    const wrapper = createWrapper(QRCodeDisplay, { props: { qrData: mockQRData } });

    expect(wrapper.find('#printable-area').exists()).toBe(true);
    expect(wrapper.find('canvas').exists()).toBe(true);
    expect(wrapper.text()).toContain('TestNetwork');
    expect(wrapper.text()).toContain('testpassword123');
  });

  it('displays correct title in English', () => {
    const wrapper = createWrapper(QRCodeDisplay, { 
      props: { qrData: mockQRData }, 
      locale: 'en' 
    });

    expect(wrapper.text()).toContain('Connect to Wi-Fi');
  });

  it('displays correct title in Vietnamese', () => {
    const wrapper = createWrapper(QRCodeDisplay, { 
      props: { qrData: mockQRData }, 
      locale: 'vi' 
    });

    expect(wrapper.text()).toContain('Kết Nối Wi-Fi');
  });

  it('shows SSID with correct label in English', () => {
    const wrapper = createWrapper(QRCodeDisplay, { 
      props: { qrData: mockQRData }, 
      locale: 'en' 
    });

    expect(wrapper.text()).toContain('Name: TestNetwork');
  });

  it('shows SSID with correct label in Vietnamese', () => {
    const wrapper = createWrapper(QRCodeDisplay, { 
      props: { qrData: mockQRData }, 
      locale: 'vi' 
    });

    expect(wrapper.text()).toContain('Tên: TestNetwork');
  });

  it('shows password with correct label in English', () => {
    const wrapper = createWrapper(QRCodeDisplay, { 
      props: { qrData: mockQRData }, 
      locale: 'en' 
    });

    expect(wrapper.text()).toContain('Password: testpassword123');
  });

  it('shows password with correct label in Vietnamese', () => {
    const wrapper = createWrapper(QRCodeDisplay, { 
      props: { qrData: mockQRData }, 
      locale: 'vi' 
    });

    expect(wrapper.text()).toContain('Mật Khẩu: testpassword123');
  });

  it('hides password section when no password', () => {
    const wrapper = createWrapper(QRCodeDisplay, { props: { qrData: mockQRDataNoPassword } });

    expect(wrapper.text()).toContain('OpenNetwork');
    expect(wrapper.text()).not.toContain('Password:');
    expect(wrapper.text()).not.toContain('Mật Khẩu:');
  });

  it('shows copy button when password exists', () => {
    const wrapper = createWrapper(QRCodeDisplay, { props: { qrData: mockQRData } });

    const copyButton = wrapper.find('button[title*="Copy"]');
    expect(copyButton.exists()).toBe(true);
  });

  it('hides copy button when no password', () => {
    const wrapper = createWrapper(QRCodeDisplay, { props: { qrData: mockQRDataNoPassword } });

    const copyButton = wrapper.find('button[title*="Copy"]');
    expect(copyButton.exists()).toBe(false);
  });

  it('calls clipboard API when copy button is clicked', async () => {
    const wrapper = createWrapper(QRCodeDisplay, { props: { qrData: mockQRData } });

    const copyButton = wrapper.find('button[title*="Copy"]');
    await copyButton.trigger('click');

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('testpassword123');
  });

  it('generates QR code on mount', () => {
    const wrapper = createWrapper(QRCodeDisplay, { props: { qrData: mockQRData } });
    
    expectQRCodeGenerated(wrapper);
  });

  it('updates QR code when data changes', async () => {
    const wrapper = createWrapper(QRCodeDisplay, { props: { qrData: mockQRData } });

    const newQRData: QRCodeData = {
      ssid: 'NewNetwork',
      encryptionType: 'WPA',
      password: 'newpassword',
      qrString: 'WIFI:S:NewNetwork;T:WPA;P:newpassword;;',
    };

    await wrapper.setProps({ qrData: newQRData });

    expect(wrapper.text()).toContain('NewNetwork');
    expect(wrapper.text()).toContain('newpassword');
  });

  it('has correct printable area ID', () => {
    const wrapper = createWrapper(QRCodeDisplay, { props: { qrData: mockQRData } });

    const printableArea = wrapper.find('#printable-area');
    expect(printableArea.exists()).toBe(true);
  });

  it('applies print-specific CSS classes', () => {
    const wrapper = createWrapper(QRCodeDisplay, { props: { qrData: mockQRData } });

    const printableArea = wrapper.find('#printable-area');
    expect(printableArea.classes()).toContain('print:p-8');
    expect(printableArea.classes()).toContain('print:shadow-none');
    expect(printableArea.classes()).toContain('print:border-none');
  });

  it('hides title with print:hidden class', () => {
    const wrapper = createWrapper(QRCodeDisplay, { props: { qrData: mockQRData } });

    const title = wrapper.find('h2');
    expect(title.classes()).toContain('print:hidden');
  });

  it('hides copy button with print:hidden class', () => {
    const wrapper = createWrapper(QRCodeDisplay, { props: { qrData: mockQRData } });

    const copyButton = wrapper.find('button[title*="Copy"]');
    expect(copyButton.classes()).toContain('print:hidden');
  });

  it('handles Vietnamese characters correctly', () => {
    const vietnameseQRData: QRCodeData = {
      ssid: 'MạngWiFiViệtNam',
      encryptionType: 'WPA',
      password: 'mậtkhẩu123',
      qrString: 'WIFI:S:MạngWiFiViệtNam;T:WPA;P:mậtkhẩu123;;',
    };

    const wrapper = createWrapper(QRCodeDisplay, { 
      props: { qrData: vietnameseQRData },
      locale: 'vi'
    });

    expect(wrapper.text()).toContain('MạngWiFiViệtNam');
    expect(wrapper.text()).toContain('mậtkhẩu123');
  });

  it('maintains responsive layout classes', () => {
    const wrapper = createWrapper(QRCodeDisplay, { props: { qrData: mockQRData } });

    const container = wrapper.find('.w-full.max-w-md');
    expect(container.exists()).toBe(true);
  });

  it('centers content correctly', () => {
    const wrapper = createWrapper(QRCodeDisplay, { props: { qrData: mockQRData } });

    const centerDiv = wrapper.find('.text-center');
    expect(centerDiv.exists()).toBe(true);
    
    const qrContainer = wrapper.find('.flex.justify-center');
    expect(qrContainer.exists()).toBe(true);
  });
});
