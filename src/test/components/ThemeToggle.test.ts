import { describe, it, expect, beforeEach } from 'vitest';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { createWrapper } from '../utils';

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
  });

  it('renders theme toggle button', () => {
    const wrapper = createWrapper(ThemeToggle);

    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
  });

  it('shows moon icon when in light mode', () => {
    // Set theme to light mode
    localStorage.setItem('theme-preference', 'light');
    const wrapper = createWrapper(ThemeToggle);

    // In light mode (isDark = false), we should see the moon icon (to switch to dark)
    expect(wrapper.html()).toContain('lucide-moon');
  });

  it('shows sun icon when in dark mode', async () => {
    const wrapper = createWrapper(ThemeToggle);

    // Toggle to dark mode first
    await wrapper.vm.toggleTheme();
    await wrapper.vm.$nextTick();

    // In dark mode (isDark = true), we should see the sun icon (to switch to light)
    expect(wrapper.html()).toContain('lucide-sun');
  });

  it('has correct accessibility attributes in English', () => {
    const wrapper = createWrapper(ThemeToggle, { locale: 'en' });

    const button = wrapper.find('button');
    expect(button.attributes('title')).toContain('Switch to');
    expect(button.attributes('aria-label')).toContain('Switch to');
  });

  it('has correct accessibility attributes in Vietnamese', () => {
    const wrapper = createWrapper(ThemeToggle, { locale: 'vi' });

    const button = wrapper.find('button');
    expect(button.attributes('title')).toContain('Chuyển sang');
    expect(button.attributes('aria-label')).toContain('Chuyển sang');
  });

  it('calls toggleTheme when clicked', async () => {
    const wrapper = createWrapper(ThemeToggle);
    const initialIsDark = wrapper.vm.isDark;

    const button = wrapper.find('button');
    await button.trigger('click');
    await wrapper.vm.$nextTick();

    // Theme should change after click
    expect(wrapper.vm.isDark).not.toBe(initialIsDark);
  });

  it('has correct CSS classes for styling', () => {
    const wrapper = createWrapper(ThemeToggle);

    const button = wrapper.find('button');
    expect(button.classes()).toContain('transition-all');
    expect(button.classes()).toContain('duration-200');
    expect(button.classes()).toContain('hover:scale-105');
  });

  it('has proper button variant and size', () => {
    const wrapper = createWrapper(ThemeToggle);

    const button = wrapper.find('button');
    // These classes come from shadcn/vue Button component
    expect(button.classes()).toContain('inline-flex');
    expect(button.classes()).toContain('items-center');
    expect(button.classes()).toContain('justify-center');
  });

  it('icons have proper accessibility attributes', () => {
    const wrapper = createWrapper(ThemeToggle);

    // Check that icons have aria-hidden attribute
    const iconElements = wrapper.findAll('[aria-hidden="true"]');
    expect(iconElements.length).toBeGreaterThan(0);
  });

  it('maintains consistent size', () => {
    const wrapper = createWrapper(ThemeToggle);

    const button = wrapper.find('button');
    // Should have icon size classes
    expect(button.html()).toContain('h-4 w-4');
  });

  it('supports keyboard navigation', () => {
    const wrapper = createWrapper(ThemeToggle);

    const button = wrapper.find('button');

    // Button should be focusable and accessible via keyboard
    expect(button.attributes('tabindex')).not.toBe('-1');
    expect(button.element.tagName).toBe('BUTTON');
  });

  it('has transition animation for icon changes', () => {
    const wrapper = createWrapper(ThemeToggle);

    // Check for transition-stub (Vue Test Utils renders Transition as transition-stub)
    expect(wrapper.html()).toContain('transition-stub');
  });

  it('maintains button state correctly', async () => {
    const wrapper = createWrapper(ThemeToggle);

    const button = wrapper.find('button');

    // Button should not be disabled
    expect(button.attributes('disabled')).toBeUndefined();
  });
});
