import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL ?? '';

export const api = axios.create({ baseURL: apiUrl, timeout: 10_000 });

export const simulateNetwork = async (duration = 350): Promise<void> => {
  await new Promise<void>((resolve) => window.setTimeout(resolve, duration));
};

export type HealthResponse = { status: 'ok' };

export const getHealth = async (): Promise<HealthResponse> => {
  const { data } = await api.get<HealthResponse>('/health');
  return data;
};
