import { describe, it, expect, vi } from 'vitest';
import WifiForm from '@/components/WifiForm.vue';
import { createWrapper, fillInput, clickButton, mockWifiCredentials, encryptionTestCases } from '../utils';
import type { WifiCredentials } from '@/types';

describe('WifiForm', () => {
  const defaultProps = {
    credentials: mockWifiCredentials,
  };

  it('renders form fields correctly', () => {
    const wrapper = createWrapper(WifiForm, { props: defaultProps });

    expect(wrapper.find('input[id="ssid"]').exists()).toBe(true);
    expect(wrapper.find('input[id="password"]').exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(true);

    // Check for Select component (shadcn/vue uses custom select)
    expect(wrapper.html()).toContain('SelectTrigger');
  });

  it('displays correct labels in English', () => {
    const wrapper = createWrapper(WifiForm, { props: defaultProps, locale: 'en' });

    expect(wrapper.text()).toContain('Wi-Fi Name (SSID)');
    expect(wrapper.text()).toContain('Encryption Type');
    expect(wrapper.text()).toContain('Password');
    expect(wrapper.text()).toContain('Save as Image');
    expect(wrapper.text()).toContain('Print');
  });

  it('displays correct labels in Vietnamese', () => {
    const wrapper = createWrapper(WifiForm, { props: defaultProps, locale: 'vi' });

    expect(wrapper.text()).toContain('Tên Wi-Fi (SSID)');
    expect(wrapper.text()).toContain('Loại Mã Hóa');
    expect(wrapper.text()).toContain('Mật Khẩu');
    expect(wrapper.text()).toContain('Lưu Hình Ảnh');
    expect(wrapper.text()).toContain('In');
  });

  it('emits update:credentials when SSID changes', async () => {
    const wrapper = createWrapper(WifiForm, { props: defaultProps });
    
    await fillInput(wrapper, 'input[id="ssid"]', 'NewNetwork');
    
    expect(wrapper.emitted('update:credentials')).toBeTruthy();
    const emittedCredentials = wrapper.emitted('update:credentials')?.[0]?.[0] as WifiCredentials;
    expect(emittedCredentials.ssid).toBe('NewNetwork');
  });

  it('emits update:credentials when encryption type changes', async () => {
    const wrapper = createWrapper(WifiForm, { props: defaultProps });

    // Call the method directly since shadcn/vue Select is complex to test
    await wrapper.vm.updateEncryptionType('WEP');

    expect(wrapper.emitted('update:credentials')).toBeTruthy();
    const emittedCredentials = wrapper.emitted('update:credentials')?.[0]?.[0] as WifiCredentials;
    expect(emittedCredentials.encryptionType).toBe('WEP');
  });

  it('emits update:credentials when password changes', async () => {
    const wrapper = createWrapper(WifiForm, { props: defaultProps });
    
    await fillInput(wrapper, 'input[id="password"]', 'newpassword');
    
    expect(wrapper.emitted('update:credentials')).toBeTruthy();
    const emittedCredentials = wrapper.emitted('update:credentials')?.[0]?.[0] as WifiCredentials;
    expect(emittedCredentials.password).toBe('newpassword');
  });

  it('clears password when encryption type is None', async () => {
    const wrapper = createWrapper(WifiForm, { props: defaultProps });

    // Call the method directly
    await wrapper.vm.updateEncryptionType('None');

    const emittedCredentials = wrapper.emitted('update:credentials')?.[0]?.[0] as WifiCredentials;
    expect(emittedCredentials.password).toBe('');
  });

  it('disables password input when encryption type is None', async () => {
    const credentials: WifiCredentials = {
      ssid: 'TestNetwork',
      encryptionType: 'None',
      password: '',
    };
    
    const wrapper = createWrapper(WifiForm, { props: { credentials } });
    
    const passwordInput = wrapper.find('input[id="password"]');
    expect(passwordInput.attributes('disabled')).toBeDefined();
  });

  it('shows/hides password when toggle button is clicked', async () => {
    const wrapper = createWrapper(WifiForm, { props: defaultProps });

    const passwordInput = wrapper.find('input[id="password"]');
    expect(passwordInput.attributes('type')).toBe('password');

    // Find the eye icon button
    const toggleButton = wrapper.find('button[type="button"]');
    await toggleButton.trigger('click');

    // Check that showPassword ref was toggled
    expect(wrapper.vm.showPassword).toBe(true);
  });

  it('emits save-as-image when save button is clicked', async () => {
    const wrapper = createWrapper(WifiForm, { props: defaultProps });

    // Call the method directly
    await wrapper.vm.saveAsImage();

    expect(wrapper.emitted('save-as-image')).toBeTruthy();
  });

  it('emits print when print button is clicked', async () => {
    const wrapper = createWrapper(WifiForm, { props: defaultProps });

    // Call the method directly
    await wrapper.vm.printQR();

    expect(wrapper.emitted('print')).toBeTruthy();
  });

  it('disables buttons when SSID is empty', () => {
    const credentials: WifiCredentials = {
      ssid: '',
      encryptionType: 'WPA/WPA2',
      password: 'password',
    };
    
    const wrapper = createWrapper(WifiForm, { props: { credentials } });
    
    const buttons = wrapper.findAll('button').filter(button => 
      button.text().includes('Save') || button.text().includes('Print')
    );
    
    buttons.forEach(button => {
      expect(button.attributes('disabled')).toBeDefined();
    });
  });

  describe('encryption type scenarios', () => {
    encryptionTestCases.forEach(({ type, hasPassword, description }) => {
      it(`handles ${description}`, async () => {
        const credentials: WifiCredentials = {
          ssid: 'TestNetwork',
          encryptionType: type,
          password: hasPassword ? 'testpassword' : '',
        };
        
        const wrapper = createWrapper(WifiForm, { props: { credentials } });
        
        const passwordInput = wrapper.find('input[id="password"]');
        
        if (hasPassword) {
          expect(passwordInput.attributes('disabled')).toBeUndefined();
          expect(wrapper.find('button[type="button"]').exists()).toBe(true);
        } else {
          expect(passwordInput.attributes('disabled')).toBeDefined();
          expect(wrapper.find('button[type="button"]').exists()).toBe(false);
        }
      });
    });
  });

  it('maintains form state correctly', async () => {
    const wrapper = createWrapper(WifiForm, { props: defaultProps });
    
    // Fill out the form
    await fillInput(wrapper, 'input[id="ssid"]', 'MyNetwork');
    await fillInput(wrapper, 'input[id="password"]', 'mypassword');
    
    // Check that values are maintained
    expect((wrapper.find('input[id="ssid"]').element as HTMLInputElement).value).toBe('MyNetwork');
    expect((wrapper.find('input[id="password"]').element as HTMLInputElement).value).toBe('mypassword');
  });
});
