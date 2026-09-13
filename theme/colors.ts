export const darkColors = {
  background: '#0F0F1A',
  card: '#1A1A2E',
  text: '#FFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  textTertiary: 'rgba(255,255,255,0.5)',
  border: '#252540',
  borderLight: 'rgba(37,37,64,0.5)',
  primary: '#4F46E5',
  primaryGradientStart: '#4F46E5',
  primaryGradientEnd: '#6C63FF',
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.15)',
  danger: '#EF4444',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  tabBar: '#0F0F1A',
  tabBarInactive: 'rgba(255,255,255,0.5)',
  inputBg: '#1A1A2E',
  iconBg: '#1A1A2E',
  overlay: 'rgba(0,0,0,0.7)'
};

export const lightColors = {
  background: '#F3F4F6',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: 'rgba(17,24,39,0.7)',
  textTertiary: 'rgba(17,24,39,0.5)',
  border: '#E5E7EB',
  borderLight: 'rgba(229,231,235,0.8)',
  primary: '#4F46E5',
  primaryGradientStart: '#4F46E5',
  primaryGradientEnd: '#6C63FF',
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.15)',
  danger: '#EF4444',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  tabBar: '#FFFFFF',
  tabBarInactive: 'rgba(17,24,39,0.5)',
  inputBg: '#F9FAFB',
  iconBg: '#F3F4F6',
  overlay: 'rgba(255,255,255,0.7)'
};

export type ThemeColors = typeof darkColors;

export const getColors = (theme: 'dark' | 'light') => {
  return theme === 'dark' ? darkColors : lightColors;
};
