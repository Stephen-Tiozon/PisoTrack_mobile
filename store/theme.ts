import { create } from 'zustand';

interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  currencyCode: string;
  currencySymbol: string;
  setCurrency: (code: string, symbol: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setTheme: (theme) => set({ theme }),
  currencyCode: 'PHP',
  currencySymbol: '₱',
  setCurrency: (currencyCode, currencySymbol) => set({ currencyCode, currencySymbol }),
}));
