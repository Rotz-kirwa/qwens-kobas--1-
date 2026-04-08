const DEFAULT_API_URL = "http://localhost:5000";

export const normalizeEnvValue = (value?: string | null, fallback = "") =>
  String(value ?? fallback).trim();

export const normalizeApiUrl = (value?: string | null, fallback = DEFAULT_API_URL) =>
  normalizeEnvValue(value, fallback).replace(/\/+$/, "");

export const normalizeClientId = (value?: string | null, fallback = "") =>
  normalizeEnvValue(value, fallback);

