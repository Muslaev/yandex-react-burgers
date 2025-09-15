export const baseURL = 'https://norma.nomoreparties.space/api';

export function checkResponse(response: Response): Promise<unknown> {
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  return response.json();
}

export function request(endpoint: string, options?: RequestInit): Promise<unknown> {
  const url = `${baseURL}${endpoint}`;
  return fetch(url, options).then(checkResponse);
}
