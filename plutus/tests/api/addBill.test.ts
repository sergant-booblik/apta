import { describe, it, expect, vi, beforeEach } from 'vitest';
import { type AddBillRequest, createAddBillFunction } from '@/api/add-bill';

describe('createAddBillFunction', () => {
  const mockApiUrl = 'https://api.example.com';

  const mockRequest: AddBillRequest = {
    userId: 42,
    title: 'Test Bill Name',
    subtitle: '',
    amount: 100,
    currencyId: 0,
  };

  const mockResponse = {
    success: true,
    billId: 'ABC12',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls fetch with correct parameters and returns parsed response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch = fetchMock;

    const addBill = createAddBillFunction(mockApiUrl);
    const result = await addBill(mockRequest);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/42/bill',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockRequest),
      },
    );

    expect(result).toEqual(mockResponse);
  });
});
