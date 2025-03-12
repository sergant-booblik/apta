import type { Expense } from '@/types/expense'
import type { ErrorData } from '@/types/error'

export interface AddExpenseRequest {
  expense: Expense,
}

export interface AddExpenseResponse {
  expense?: Expense,
  errors?: ErrorData,
}

export function createAddExpenseFunction(apiUrl: string): (request: AddExpenseRequest) => Promise<AddExpenseResponse> {
  return (request: AddExpenseRequest): Promise<AddExpenseResponse> => {
  const url = new URL(`${apiUrl}/expense/`);
    return fetch(url.toString(), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.expense)
    }).then((resp) => resp.json())
      .then((resp: AddExpenseResponse) => resp)
      .catch((errors: AddExpenseResponse) => errors)
  }
}