import { describe, it, expect, vi, beforeEach } from 'vitest';
import { type AddSubcategoryRequest, createAddSubcategoryFunction } from '@/api/add-subcategory';

describe('createAddSubcategoryFunction', () => {
  const mockApiUrl = 'https://api.example.com';

  const mockRequest: AddSubcategoryRequest = {
    subcategory: {
      categoryId: 0,
      name: 'Test subcategory',
      emoji: '✅',
    },
  };

  const mockResponse = {
    subcategory: {
      id: 0,
      categoryId: 0,
      name: 'Test subcategory',
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

    const addSubcategory = createAddSubcategoryFunction(mockApiUrl);
    const result = await addSubcategory(mockRequest);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/subcategory/',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockRequest.subcategory),
      },
    );

    expect(result).toEqual(mockResponse);
  });
});
