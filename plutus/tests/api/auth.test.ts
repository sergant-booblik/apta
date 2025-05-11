import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createVerifyTokenFunction, createRefreshTokenFunction } from '@/api/auth';

describe('createVerifyTokenFunction', () => {
  const mockApiUrl = 'https://api.example.com';

  const mockResponse = {
    success: true,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls fetch with correct parameters and returns parsed response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch = fetchMock;

    const verifyToken = createVerifyTokenFunction(mockApiUrl);
    const result = await verifyToken();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/auth/verify/',
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    expect(result).toEqual(mockResponse);
  });
});

describe('createRefreshTokenFunction', () => {
  const mockApiUrl = 'https://api.example.com';

  const mockResponse = {
    success: true,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls fetch with correct parameters and returns parsed response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch = fetchMock;

    const refreshToken = createRefreshTokenFunction(mockApiUrl);
    const result = await refreshToken();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/auth/refresh/',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    expect(result).toEqual(mockResponse);
  });
});