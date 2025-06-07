import { describe, it, expect, vi, beforeEach } from 'vitest';
import LanguageToggle from '@/components/LanguageToggle.vue';
import { createWrapper } from '../utils';

// Create mock functions that we can control
const mockChangeLocale = vi.fn();
const mockCurrentLocale = { value: 'en' };

// Mock the useI18nUtils composable
vi.mock('@/composables/useI18nUtils', () => ({
  useI18nUtils: () => ({
    currentLocale: mockCurrentLocale,
    availableLocales: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    ],
    changeLocale: mockChangeLocale,
    t: vi.fn((key: string) => key),
  }),
}));

describe('LanguageToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentLocale.value = 'en';
  });

  it('renders language selector', () => {
    const wrapper = createWrapper(LanguageToggle);

    // Should have a button (the select trigger)
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
  });

  it('displays current language code', () => {
    const wrapper = createWrapper(LanguageToggle);

    // Should show "EN" for English
    expect(wrapper.text()).toContain('EN');
  });

  it('shows available language options', async () => {
    const wrapper = createWrapper(LanguageToggle);

    // Click to open dropdown
    const selectTrigger = wrapper.find('[role="combobox"]');
    await selectTrigger.trigger('click');

    // Should show both language options
    expect(wrapper.text()).toContain('English');
    expect(wrapper.text()).toContain('Tiếng Việt');
  });

  it('displays flag emojis for languages', async () => {
    const wrapper = createWrapper(LanguageToggle);

    // Click to open dropdown
    const selectTrigger = wrapper.find('[role="combobox"]');
    await selectTrigger.trigger('click');

    // Should show flag emojis
    expect(wrapper.text()).toContain('🇺🇸');
    expect(wrapper.text()).toContain('🇻🇳');
  });

  it('emits language-changed when selection changes', async () => {
    const wrapper = createWrapper(LanguageToggle);

    // Simulate language change by calling the method directly
    if (wrapper.vm.handleLanguageChange) {
      await wrapper.vm.handleLanguageChange('vi');
    }

    expect(mockChangeLocale).toHaveBeenCalledWith('vi');
    expect(wrapper.emitted('language-changed')).toBeTruthy();
    expect(wrapper.emitted('language-changed')?.[0]).toEqual(['vi']);
  });

  it('shows correct language code for Vietnamese', () => {
    mockCurrentLocale.value = 'vi';
    const wrapper = createWrapper(LanguageToggle);

    // Should show "VI" for Vietnamese
    expect(wrapper.text()).toContain('VI');
  });

  it('has correct width constraint', () => {
    const wrapper = createWrapper(LanguageToggle);

    const selectTrigger = wrapper.find('button');
    expect(selectTrigger.classes()).toContain('w-24');
  });

  it('maintains proper accessibility', () => {
    const wrapper = createWrapper(LanguageToggle);

    const selectTrigger = wrapper.find('[role="combobox"]');
    expect(selectTrigger.exists()).toBe(true);
    
    // Should have proper ARIA attributes
    expect(selectTrigger.attributes('aria-expanded')).toBeDefined();
  });

  it('handles keyboard navigation', async () => {
    const wrapper = createWrapper(LanguageToggle);

    const selectTrigger = wrapper.find('[role="combobox"]');
    
    // Should be focusable
    await selectTrigger.trigger('focus');
    expect(selectTrigger.attributes('tabindex')).not.toBe('-1');
    
    // Should respond to Enter key
    await selectTrigger.trigger('keydown.enter');
    // Dropdown should open (implementation depends on shadcn/vue Select)
  });

  it('displays language names correctly', async () => {
    const wrapper = createWrapper(LanguageToggle);

    // Click to open dropdown
    const selectTrigger = wrapper.find('[role="combobox"]');
    await selectTrigger.trigger('click');

    // Check for proper language names
    expect(wrapper.text()).toContain('English');
    expect(wrapper.text()).toContain('Tiếng Việt');
  });

  it('maintains consistent styling', () => {
    const wrapper = createWrapper(LanguageToggle);

    const container = wrapper.find('.flex.items-center.gap-2');
    expect(container.exists()).toBe(true);
  });

  it('handles language switching correctly', async () => {
    const wrapper = createWrapper(LanguageToggle);

    // Test the getLanguageCode function
    expect(wrapper.vm.getLanguageCode('en')).toBe('EN');
    expect(wrapper.vm.getLanguageCode('vi')).toBe('VI');
  });

  it('integrates with shadcn/vue Select components', () => {
    const wrapper = createWrapper(LanguageToggle);

    // Should use shadcn/vue Select components
    expect(wrapper.html()).toContain('SelectTrigger');
    expect(wrapper.html()).toContain('SelectValue');
  });

  it('shows proper flag and text layout', async () => {
    const wrapper = createWrapper(LanguageToggle);

    // Click to open dropdown
    const selectTrigger = wrapper.find('[role="combobox"]');
    await selectTrigger.trigger('click');

    // Should have proper flex layout for flag and text
    const flagTextContainers = wrapper.findAll('.flex.items-center.gap-2');
    expect(flagTextContainers.length).toBeGreaterThan(0);
  });
});
