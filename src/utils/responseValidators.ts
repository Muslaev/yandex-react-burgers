import type {
  TIngredientsResponse,
  TOrderResponse,
  TUserResponse,
  TLogoutResponse,
  TPasswordResetResponse,
  TRefreshTokenResponse,
} from './types';

type PartialIngredientsResponse = Partial<TIngredientsResponse>;

export const isPartialIngredientsResponse = (
  rawData: unknown
): rawData is PartialIngredientsResponse => {
  if (!rawData || typeof rawData !== 'object') return false;
  const obj = rawData as Record<string, unknown>;

  if ('success' in obj && typeof obj.success !== 'boolean') return false;
  if ('data' in obj && !Array.isArray(obj.data)) return false;

  return true;
};

type PartialOrderResponse = Partial<TOrderResponse>;

export const isPartialOrderResponse = (data: unknown): data is PartialOrderResponse => {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  if ('success' in obj && typeof obj.success !== 'boolean') return false;
  if ('name' in obj && typeof obj.name !== 'string') return false;

  if ('order' in obj && obj.order && typeof obj.order === 'object') {
    const order = obj.order as Record<string, unknown>;
    if ('number' in order && typeof order.number !== 'number') return false;
  } else {
    return false;
  }

  return true;
};

type PartialUserResponse = Partial<TUserResponse>;

export const isPartialUserResponse = (data: unknown): data is PartialUserResponse => {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  if ('success' in obj && typeof obj.success !== 'boolean') return false;
  if ('user' in obj && obj.user && typeof obj.user === 'object') {
    const user = obj.user as Record<string, unknown>;
    if ('email' in user && typeof user.email !== 'string') return false;
    if ('name' in user && typeof user.name !== 'string') return false;
  } else {
    return false;
  }
  if ('accessToken' in obj && typeof obj.accessToken !== 'string') return false;
  if ('refreshToken' in obj && typeof obj.refreshToken !== 'string') return false;

  return true;
};

export const isPartialLogoutResponse = (
  data: unknown
): data is Partial<TLogoutResponse> => {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  if ('success' in obj && typeof obj.success !== 'boolean') return false;
  if ('message' in obj && typeof obj.message !== 'string') return false;

  return true;
};

export const isPartialPasswordResetResponse = (
  data: unknown
): data is Partial<TPasswordResetResponse> => {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  if ('success' in obj && typeof obj.success !== 'boolean') return false;
  if ('message' in obj && typeof obj.message !== 'string') return false;

  return true;
};

export const isPartialRefreshTokenResponse = (
  data: unknown
): data is Partial<TRefreshTokenResponse> => {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  if ('success' in obj && typeof obj.success !== 'boolean') return false;
  if ('accessToken' in obj && typeof obj.accessToken !== 'string') return false;
  if ('refreshToken' in obj && typeof obj.refreshToken !== 'string') return false;

  return true;
};
