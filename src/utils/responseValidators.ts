import type {
  TIngredientsResponse,
  TOrderResponse,
  TUserResponse,
  TLogoutResponse,
  TPasswordResetResponse,
  TRefreshTokenResponse,
  TOrderItem,
  TOrderDetailsResponse,
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

export const isPartialOrderDetailsResponse = (
  rawData: unknown
): rawData is Partial<TOrderDetailsResponse> => {
  if (!rawData || typeof rawData !== 'object') return false;
  const obj = rawData as Record<string, unknown>;

  if ('success' in obj && typeof obj.success !== 'boolean') return false;
  if ('data' in obj && !Array.isArray(obj.data)) return false;

  return true;
};

const isValidOrder = (order: unknown): order is TOrderItem => {
  if (!order || typeof order !== 'object') return false;
  const obj = order as Record<string, unknown>;

  if (!('_id' in obj) || typeof obj._id !== 'string') return false;
  if (!('name' in obj) || typeof obj.name !== 'string') return false;
  if (!('status' in obj) || typeof obj.status !== 'string') return false;
  if (!('number' in obj) || typeof obj.number !== 'number') return false;
  if (!('createdAt' in obj) || typeof obj.createdAt !== 'string') return false;
  if (!('updatedAt' in obj) || typeof obj.updatedAt !== 'string') return false;

  if (!('ingredients' in obj) || !Array.isArray(obj.ingredients)) return false;
  if (!obj.ingredients.every((ing): ing is string => typeof ing === 'string'))
    return false;

  return true;
};

export const validateOrders = (orders: unknown): TOrderItem[] => {
  if (!Array.isArray(orders)) return [];
  return orders.filter(isValidOrder);
};
