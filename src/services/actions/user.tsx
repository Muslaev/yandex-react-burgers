import { request } from '@/utils/urls';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { setCookie, getCookie, deleteCookie } from '@utils/cookieUtils';
import {
  isPartialUserResponse,
  isPartialLogoutResponse,
  isPartialPasswordResetResponse,
  isPartialRefreshTokenResponse,
} from '@utils/responseValidators';

import type {
  TUserResponse,
  TLogoutResponse,
  TPasswordResetResponse,
  UserState,
} from '@utils/types';

export const registerUser = createAsyncThunk<
  TUserResponse,
  { email: string; password: string; name: string },
  { rejectValue: string }
>('user/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const rawData: unknown = await request('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (isPartialUserResponse(rawData)) {
      const data = rawData as TUserResponse;
      if (!data.success) {
        throw new Error('Registration failed');
      }
      if (data.refreshToken) {
        setCookie('refreshToken', data.refreshToken, 7);
      }
      const accessToken = data.accessToken?.startsWith('Bearer ')
        ? data.accessToken.replace('Bearer ', '')
        : data.accessToken;
      return {
        ...data,
        accessToken,
      };
    } else {
      throw new Error('Invalid API response structure');
    }
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
  }
});

export const loginUser = createAsyncThunk<
  TUserResponse,
  { email: string; password: string },
  { rejectValue: string }
>('user/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const rawData: unknown = await request('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (isPartialUserResponse(rawData)) {
      const data = rawData as TUserResponse;
      if (!data.success) {
        throw new Error('Login failed');
      }
      if (data.refreshToken) {
        setCookie('refreshToken', data.refreshToken, 7);
      }
      const accessToken = data.accessToken?.startsWith('Bearer ')
        ? data.accessToken.replace('Bearer ', '')
        : data.accessToken;
      return {
        ...data,
        accessToken,
      };
    } else {
      throw new Error('Invalid API response structure');
    }
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
  }
});

export const logoutUser = createAsyncThunk<
  TLogoutResponse,
  void,
  { rejectValue: string }
>('user/logoutUser', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const rawData: unknown = await request('/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (isPartialLogoutResponse(rawData)) {
      const data = rawData as TLogoutResponse;
      if (!data.success) {
        throw new Error('Logout failed');
      }
      deleteCookie('refreshToken');
      return data;
    } else {
      throw new Error('Invalid API response structure');
    }
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
  }
});

export const refreshToken = createAsyncThunk<
  Omit<TUserResponse, 'user'>,
  void,
  { rejectValue: string }
>('user/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const refreshTokenValue = getCookie('refreshToken');
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    const rawData: unknown = await request('/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshTokenValue }),
    });

    if (isPartialRefreshTokenResponse(rawData)) {
      const data = rawData as Omit<TUserResponse, 'user'>;
      if (!data.success) {
        throw new Error('Token refresh failed');
      }
      if (data.refreshToken) {
        setCookie('refreshToken', data.refreshToken, 7);
      }
      const accessToken = data.accessToken?.startsWith('Bearer ')
        ? data.accessToken.replace('Bearer ', '')
        : data.accessToken;
      return {
        success: data.success,
        accessToken,
        refreshToken: data.refreshToken,
      };
    } else {
      throw new Error('Invalid API response structure');
    }
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
  }
});

export const forgotPassword = createAsyncThunk<
  TPasswordResetResponse,
  { email: string },
  { rejectValue: string }
>('user/forgotPassword', async (emailData, { rejectWithValue }) => {
  try {
    const rawData: unknown = await request('/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (isPartialPasswordResetResponse(rawData)) {
      const data = rawData as TPasswordResetResponse;
      if (!data.success) {
        throw new Error('Password reset request failed');
      }
      return data;
    } else {
      throw new Error('Invalid API response structure');
    }
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
  }
});

export const resetPassword = createAsyncThunk<
  TPasswordResetResponse,
  { password: string; token: string },
  { rejectValue: string }
>('user/resetPassword', async (resetData, { rejectWithValue }) => {
  try {
    const rawData: unknown = await request('/password-reset/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetData),
    });

    if (isPartialPasswordResetResponse(rawData)) {
      const data = rawData as TPasswordResetResponse;
      if (!data.success) {
        throw new Error('Password reset failed');
      }
      return data;
    } else {
      throw new Error('Invalid API response structure');
    }
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
  }
});

export const fetchUser = createAsyncThunk<
  TUserResponse,
  void,
  { rejectValue: string; state: { user: UserState } }
>('user/fetchUser', async (_, { rejectWithValue, getState }) => {
  try {
    const { accessToken } = getState().user;
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const rawData: unknown = await request('/auth/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (isPartialUserResponse(rawData)) {
      const data = rawData as TUserResponse;
      if (!data.success) {
        throw new Error('Failed to fetch user data');
      }
      return data;
    } else {
      throw new Error('Invalid API response structure');
    }
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
  }
});

export const updateUser = createAsyncThunk<
  TUserResponse,
  { email?: string; name?: string; password?: string },
  { rejectValue: string; state: { user: UserState } }
>('user/updateUser', async (userData, { rejectWithValue, getState }) => {
  try {
    const { accessToken } = getState().user;
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const rawData: unknown = await request('/auth/user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });

    if (isPartialUserResponse(rawData)) {
      const data = rawData as TUserResponse;
      if (!data.success) {
        throw new Error('Failed to update user data');
      }
      return data;
    } else {
      throw new Error('Invalid API response structure');
    }
  } catch (e) {
    return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
  }
});
