export const baseURL = 'https://norma.education-services.ru/api';
export const baseSocketURL = 'wss://norma.education-services.ru/orders';

export function checkResponse(response: Response): Promise<unknown> {
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  return response.json();
}

export function request(endpoint: string, options?: RequestInit): Promise<unknown> {
  const url = `${baseURL}${endpoint}`;
  console.log(url);
  return fetch(url, options).then(checkResponse);
}
