export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TIngredientWithCounter = TIngredient & { count: number };
export type TIngredientWithKey = TIngredientWithCounter & { key: string };

// Response types
export type TUserResponse = {
  success: boolean;
  user: TUser;
  accessToken?: string;
  refreshToken?: string;
};

export type TRefreshTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TLogoutResponse = {
  success: boolean;
  message: string;
};

export type TPasswordResetResponse = {
  success: boolean;
  message: string;
};

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export type TOrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

// State types
export type TUser = {
  email: string;
  name: string;
};

export type UserState = {
  user: TUser | null;
  initialUser: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  accessToken?: string;
  passwordResetRequested: boolean;
};

export type ConstructorState = {
  bun: TIngredientWithCounter | null;
  constructorIngredients: TIngredientWithKey[];
};

export type IngredientDetailsState = {
  ingredient: TIngredient | null;
};

export type IngredientsState = {
  ingredients: TIngredientWithCounter[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

export type OrderState = {
  orderNumber: number | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};
