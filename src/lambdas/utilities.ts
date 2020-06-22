export interface Response {
  statusCode: number;
  body: string;
  headers?: { [name: string]: string | boolean };
}

export type ResponseCode = 200 | 400 | 401 | 403 | 404 | 422 | 500 | 502 | 504;

export const DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export function createResponse(
  code: ResponseCode,
  body: { [key: string]: any },
  headers?: { [key: string]: string | boolean }
): Response {
  return {
    body: JSON.stringify(body),
    headers: { ...DEFAULT_HEADERS, ...headers },
    statusCode: code,
  };
}