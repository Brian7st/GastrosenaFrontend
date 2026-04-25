import { AppState } from '../app.state';

export const selectUiState = (state: AppState) => state.ui;
export const selectIsLoading = (state: AppState) => state.ui.isLoading;
export const selectSidebarOpen = (state: AppState) => state.ui.sidebarOpen;
