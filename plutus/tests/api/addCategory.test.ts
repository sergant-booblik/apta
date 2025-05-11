import { describe, it, expect, vi, beforeEach } from 'vitest';
import { type AddCategoryRequest, createAddCategoryFunction } from '@/api/add-category';

describe('createAddCategoryFunction', () => {
  const mockApiUrl = 'https://api.example.com';

  const mockRequest: AddCategoryRequest = {
    category: {
      type: 'expense',
      name: 'Test category',
      emoji: '✅',
    },
  };

  const mockResponse = {
    category: {
      id: 0,
      type: 'expense',
      name: 'Test category',
      emoji: '✅',
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls fetch with correct parameters and returns parsed response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch = fetchMock;

    const addCategory = createAddCategoryFunction(mockApiUrl);
    const result = await addCategory(mockRequest);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/category/',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockRequest.category),
      },
    );

    expect(result).toEqual(mockResponse);
  });
});
