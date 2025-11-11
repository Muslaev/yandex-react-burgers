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
import reducer, { resetUser, resetUserToInitial } from './user';

import type { UserState } from '@/utils/types';

describe('user slice', () => {
  const mockUser = { email: 'test@example.com', name: 'Test User' };

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

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('registerUser', () => {
    it('should set isLoading true on pending', () => {
      const action = { type: registerUser.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        hasError: false,
        errorMessage: undefined,
      });
    });

    it('should set user, authenticated, and accessToken on fulfilled', () => {
      const payload = {
        success: true,
        user: mockUser,
        accessToken: 'token123',
        refreshToken: 'refresh123',
      };
      const action = { type: registerUser.fulfilled.type, payload };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        isAuthenticated: true,
        user: mockUser,
        initialUser: mockUser,
        accessToken: 'token123',
      });
    });

    it('should set error on rejected', () => {
      const errorMessage = 'Registration failed';
      const action = { type: registerUser.rejected.type, payload: errorMessage };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        hasError: true,
        errorMessage,
      });
    });
  });

  describe('loginUser', () => {
    it('should set isLoading true on pending', () => {
      const action = { type: loginUser.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.hasError).toBe(false);
    });

    it('should set user, authenticated, and accessToken on fulfilled', () => {
      const payload = {
        success: true,
        user: mockUser,
        accessToken: 'token456',
      };
      const action = { type: loginUser.fulfilled.type, payload };
      const state = reducer(initialState, action);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.initialUser).toEqual(mockUser);
      expect(state.accessToken).toBe('token456');
    });

    it('should set error on rejected', () => {
      const action = { type: loginUser.rejected.type, payload: 'Login failed' };
      const state = reducer(initialState, action);
      expect(state.hasError).toBe(true);
      expect(state.errorMessage).toBe('Login failed');
    });
  });

  describe('logoutUser', () => {
    it('should set isLoading true on pending', () => {
      const action = { type: logoutUser.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('should reset user and authenticated on fulfilled', () => {
      const authState: UserState = {
        ...initialState,
        isAuthenticated: true,
        user: mockUser,
        initialUser: mockUser,
        accessToken: 'token',
        passwordResetRequested: true,
      };
      const payload = { success: true, message: 'Logged out' };
      const action = { type: logoutUser.fulfilled.type, payload };
      const state = reducer(authState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        initialUser: null,
        accessToken: undefined,
        passwordResetRequested: false,
      });
    });

    it('should set error on rejected', () => {
      const action = { type: logoutUser.rejected.type, payload: 'Logout failed' };
      const state = reducer(initialState, action);
      expect(state.hasError).toBe(true);
      expect(state.errorMessage).toBe('Logout failed');
    });
  });

  describe('refreshToken', () => {
    it('should set isLoading true on pending', () => {
      const action = { type: refreshToken.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('should update accessToken on fulfilled', () => {
      const payload = {
        success: true,
        accessToken: 'newToken',
        refreshToken: 'newRefresh',
      };
      const action = { type: refreshToken.fulfilled.type, payload };
      const state = reducer(initialState, action);
      expect(state.accessToken).toBe('newToken');
      expect(state.isLoading).toBe(false);
    });

    it('should set error on rejected', () => {
      const action = { type: refreshToken.rejected.type, payload: 'Refresh failed' };
      const state = reducer(initialState, action);
      expect(state.hasError).toBe(true);
      expect(state.errorMessage).toBe('Refresh failed');
    });
  });

  describe('forgotPassword', () => {
    it('should set isLoading true on pending', () => {
      const action = { type: forgotPassword.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('should set passwordResetRequested true on fulfilled', () => {
      const payload = { success: true, message: 'Reset requested' };
      const action = { type: forgotPassword.fulfilled.type, payload };
      const state = reducer(initialState, action);
      expect(state.passwordResetRequested).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should set error on rejected', () => {
      const action = { type: forgotPassword.rejected.type, payload: 'Request failed' };
      const state = reducer(initialState, action);
      expect(state.hasError).toBe(true);
      expect(state.errorMessage).toBe('Request failed');
    });
  });

  describe('resetPassword', () => {
    it('should set isLoading true on pending', () => {
      const action = { type: resetPassword.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('should reset passwordResetRequested on fulfilled', () => {
      const requestedState: UserState = {
        ...initialState,
        passwordResetRequested: true,
      };
      const payload = { success: true, message: 'Password reset' };
      const action = { type: resetPassword.fulfilled.type, payload };
      const state = reducer(requestedState, action);
      expect(state.passwordResetRequested).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should set error on rejected', () => {
      const action = { type: resetPassword.rejected.type, payload: 'Reset failed' };
      const state = reducer(initialState, action);
      expect(state.hasError).toBe(true);
      expect(state.errorMessage).toBe('Reset failed');
    });
  });

  describe('fetchUser', () => {
    it('should set isLoading true on pending', () => {
      const action = { type: fetchUser.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('should set user and authenticated on fulfilled', () => {
      const payload = { success: true, user: mockUser };
      const action = { type: fetchUser.fulfilled.type, payload };
      const state = reducer(initialState, action);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.initialUser).toEqual(mockUser);
    });

    it('should set error on rejected', () => {
      const action = { type: fetchUser.rejected.type, payload: 'Fetch failed' };
      const state = reducer(initialState, action);
      expect(state.hasError).toBe(true);
      expect(state.errorMessage).toBe('Fetch failed');
    });
  });

  describe('updateUser', () => {
    it('should set isLoading true on pending', () => {
      const action = { type: updateUser.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
    });

    it('should update user and initialUser on fulfilled', () => {
      const currentState: UserState = {
        ...initialState,
        user: mockUser,
        initialUser: mockUser,
      };
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const payload = { success: true, user: updatedUser };
      const action = { type: updateUser.fulfilled.type, payload };
      const state = reducer(currentState, action);
      expect(state.user).toEqual(updatedUser);
      expect(state.initialUser).toEqual(updatedUser);
      expect(state.isLoading).toBe(false);
    });

    it('should set error on rejected', () => {
      const action = { type: updateUser.rejected.type, payload: 'Update failed' };
      const state = reducer(initialState, action);
      expect(state.hasError).toBe(true);
      expect(state.errorMessage).toBe('Update failed');
    });
  });

  describe('resetUser', () => {
    const filledState: UserState = {
      user: mockUser,
      initialUser: mockUser,
      isAuthenticated: true,
      isLoading: true,
      hasError: true,
      errorMessage: 'Error',
      accessToken: 'token',
      passwordResetRequested: true,
    };

    it('should reset to initial state', () => {
      const state = reducer(filledState, resetUser());
      expect(state).toEqual(initialState);
    });
  });

  describe('resetUserToInitial', () => {
    it('should reset user to initialUser if exists', () => {
      const state: UserState = {
        ...initialState,
        user: { ...mockUser, name: 'Modified' },
        initialUser: mockUser,
      };
      const resetState = reducer(state, resetUserToInitial());
      expect(resetState.user).toEqual(mockUser);
    });

    it('should do nothing if initialUser is null', () => {
      const state: UserState = {
        ...initialState,
        user: mockUser,
        initialUser: null,
      };
      const resetState = reducer(state, resetUserToInitial());
      expect(resetState.user).toEqual(mockUser);
    });
  });
});
