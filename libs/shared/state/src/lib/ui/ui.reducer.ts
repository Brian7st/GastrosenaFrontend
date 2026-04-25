export interface UiState {
  isLoading: boolean;
  sidebarOpen: boolean;
  activeTheme: 'light' | 'dark';
}

export const initialUiState: UiState = {
  isLoading: false,
  sidebarOpen: true,
  activeTheme: 'light',
};
