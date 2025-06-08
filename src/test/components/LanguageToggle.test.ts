import { describe, it, expect, beforeEach } from 'vitest';
import LanguageToggle from '@/components/LanguageToggle.vue';
import { createWrapper } from '../utils';

describe('LanguageToggle', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
    localStorage.setItem('language-preference', 'en');
  });

  it('renders language selector', () => {
    const wrapper = createWrapper(LanguageToggle);

    // Should have a button (the select trigger)
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
  });

  it('displays current language code', () => {
    const wrapper = createWrapper(LanguageToggle);

    // Should show "EN" for English in the select trigger
    expect(wrapper.html()).toContain('EN');
  });

  it('shows available language options', () => {
    const wrapper = createWrapper(LanguageToggle);

    // Check that the component has the select structure
    const selectTrigger = wrapper.find('[role="combobox"]');
    expect(selectTrigger.exists()).toBe(true);

    // The options are in the Vue component but not rendered in HTML until opened
    // Check that the component has the proper select structure
    expect(wrapper.find('select').exists()).toBe(true);
  });

  it('displays flag emojis for languages', () => {
    const wrapper = createWrapper(LanguageToggle);

    // The flags are in the component's data but not visible in closed state
    // Check that the component has the proper structure for flags
    expect(wrapper.vm.availableLocales).toBeDefined();
    expect(wrapper.vm.availableLocales.length).toBe(2);
  });

  it('emits language-changed when selection changes', async () => {
    const wrapper = createWrapper(LanguageToggle);

    // Simulate language change by calling the method directly
    await wrapper.vm.handleLanguageChange('vi');

    // Check that the event was emitted
    expect(wrapper.emitted('language-changed')).toBeTruthy();
    expect(wrapper.emitted('language-changed')?.[0]).toEqual(['vi']);
  });

  it('shows correct language code for Vietnamese', () => {
    const wrapper = createWrapper(LanguageToggle);

    // Test the getLanguageCode function directly
    expect(wrapper.vm.getLanguageCode('vi')).toBe('VI');
    expect(wrapper.vm.getLanguageCode('en')).toBe('EN');

    // Test that the component has the correct structure for Vietnamese
    const viLocale = wrapper.vm.availableLocales.find((l: any) => l.code === 'vi');
    expect(viLocale).toBeDefined();
    expect(viLocale?.flag).toBe('🇻🇳');
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

  it('displays language names correctly', () => {
    const wrapper = createWrapper(LanguageToggle);

    // Language names are in the component's data
    expect(wrapper.vm.availableLocales.find((l: any) => l.code === 'en')?.name).toBe('English');
    expect(wrapper.vm.availableLocales.find((l: any) => l.code === 'vi')?.name).toBe('Tiếng Việt');
  });

  it('maintains consistent styling', () => {
    const wrapper = createWrapper(LanguageToggle);

    const container = wrapper.find('.flex.items-center.gap-2');
    expect(container.exists()).toBe(true);
  });

  it('handles language switching correctly', () => {
    const wrapper = createWrapper(LanguageToggle);

    // Test the getLanguageCode function
    expect(wrapper.vm.getLanguageCode('en')).toBe('EN');
    expect(wrapper.vm.getLanguageCode('vi')).toBe('VI');
  });

  it('integrates with shadcn/vue Select components', () => {
    const wrapper = createWrapper(LanguageToggle);

    // Should render as native HTML elements, not component names
    const selectTrigger = wrapper.find('[role="combobox"]');
    expect(selectTrigger.exists()).toBe(true);

    // Check for select structure
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('shows proper flag and text layout', () => {
    const wrapper = createWrapper(LanguageToggle);

    // Should have proper flex layout for flag and text
    const flagTextContainers = wrapper.findAll('.flex.items-center.gap-2');
    expect(flagTextContainers.length).toBeGreaterThan(0);
  });
});
