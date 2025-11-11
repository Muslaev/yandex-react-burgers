import { createSlice } from '@reduxjs/toolkit';

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  fetchUser,
  updateUser,
} from '../actions/user';

import type { TUser, UserState } from '@utils/types';

const initialState: UserState = {
  user: null,
  initialUser: null,
  isAuthenticated: false,
  isLoading: false,
  hasError: false,
  errorMessage: undefined,
  accessToken: undefined,
  passwordResetRequested: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: (state) => {
      state.user = null;
      state.initialUser = null;
      state.isAuthenticated = false;
      state.hasError = false;
      state.errorMessage = undefined;
      state.accessToken = undefined;
      state.passwordResetRequested = false;
      state.isLoading = false;
    },
    resetUserToInitial: (state) => {
      if (state.initialUser) {
        state.user = { ...state.initialUser };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.initialUser = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.initialUser = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = undefined;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.initialUser = null;
        state.accessToken = undefined;
        state.passwordResetRequested = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload;
      })
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = undefined;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = undefined;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetRequested = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = undefined;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetRequested = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = undefined;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.initialUser = action.payload.user;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = undefined;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.initialUser = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { resetUser, resetUserToInitial } = userSlice.actions;
export default userSlice.reducer;

export const selectUser = (state: { user: UserState }): TUser | null => state.user.user;
export const selectInitialUser = (state: { user: UserState }): TUser | null =>
  state.user.initialUser;
export const selectIsAuthenticated = (state: { user: UserState }): boolean =>
  state.user.isAuthenticated;
export const selectIsUserLoading = (state: { user: UserState }): boolean =>
  state.user.isLoading;
export const selectUserError = (state: { user: UserState }): string | undefined =>
  state.user.errorMessage;
export const selectUserHasError = (state: { user: UserState }): boolean =>
  state.user.hasError;
export const selectPasswordResetRequested = (state: { user: UserState }): boolean =>
  state.user.passwordResetRequested;
