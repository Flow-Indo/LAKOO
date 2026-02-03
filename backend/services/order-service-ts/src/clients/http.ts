import axios, { AxiosInstance } from 'axios';

const OUTBOUND_HTTP_TIMEOUT_MS = Number(process.env.OUTBOUND_HTTP_TIMEOUT_MS || 5000);

export function createHttpClient(baseURL: string): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: OUTBOUND_HTTP_TIMEOUT_MS
  });
}

