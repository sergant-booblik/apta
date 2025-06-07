import { ref } from 'vue';
import type { Ref } from 'vue';
import { createRefreshTokenFunction, createVerifyTokenFunction } from '@/api/auth';
import { createFetchCurrenciesFunction } from '@/api/fetch-currencies';
import { createLoginFunction } from '@/api/login';
import { createFetchBillsFunction } from '@/api/fetch-bills';
import { createAddBillFunction } from '@/api/add-bill';
import { createUploadBillIconFunction } from '@/api/upload-bill-icon';
import { createFetchUserFunction } from '@/api/fetch-user';
import { createLogoutFunction } from '@/api/logout';
import { createUpdateProfileFunction } from '@/api/update-profile';
import { createDeleteBillFunction } from '@/api/delete-bill';
import { createUpdateBillFunction } from '@/api/update-bill';
import { createFetchBillTransactionFunction } from '@/api/fetch-bill-transactions';
import { createFetchTotalSumFunction } from '@/api/fetch-total-sum';
import type { VerifyTokenResponse, RefreshTokenResponse } from '@/api/auth';
import type { LoginRequest, LoginResponse } from '@/api/login';
import type { FetchBillsResponse, FetchBillRequest } from '@/api/fetch-bills';
import type { FetchCurrenciesResponse } from '@/api/fetch-currencies';
import type { AddBillRequest, AddBillResponse } from '@/api/add-bill';
import type { UploadBillIconRequest, UploadBillIconResponse } from '@/api/upload-bill-icon';
import type { UpdateProfileRequest, UpdateProfileResponse } from '@/api/update-profile';
import type { FetchUserResponse } from '@/api/fetch-user';
import type { LogoutResponse } from '@/api/logout';
import type { DeleteBillRequest, DeleteBillResponse } from '@/api/delete-bill';
import type { UpdateBillRequest, UpdateBillResponse } from '@/api/update-bill';
import type { FetchBillTransactionsRequest, FetchBillTransactionsResponse } from '@/api/fetch-bill-transactions';
import type { FetchTotalSumRequest, FetchTotalSumResponse } from '@/api/fetch-total-sum';
import {
  createFetchCategoriesFunction,
  type FetchCategoriesRequest,
  type FetchCategoriesResponse,
} from '@/api/fetch-categories';
import {
  createFetchSubcategoriesFunction,
  type FetchSubcategoriesRequest,
  type FetchSubcategoriesResponse,
} from '@/api/fetch-subcategories';
import { createFetchUnitsFunction, type FetchUnitsResponse } from '@/api/fetch-units';
import { type AddExpenseRequest, type AddExpenseResponse, createAddExpenseFunction } from '@/api/add-expense';
import type { AddCategoryRequest, AddCategoryResponse } from '@/api/add-category';
import type { AddSubcategoryRequest, AddSubcategoryResponse } from '@/api/add-subcategory';
import { createAddCategoryFunction } from '@/api/add-category';
import { createAddSubcategoryFunction } from '@/api/add-subcategory';
import {
  createReorderBillsFunction,
  type ReorderBillsRequest,
  type ReorderBillsResponse,
} from '@/api/reorder-biils';
import {
  createRegisterFunction,
  type RegisterRequest,
  type RegisterResponse,
} from '@/api/register';
import {
  createFetchTranslationsFunction,
  type FetchTranslationsRequest,
  type FetchTranslationsResponse,
} from '@/api/fetch-translations';

const userId = ref(0);
const accessToken = ref('');

interface Api {
  userId: Ref<number>;
  accessToken: Ref<string | undefined>;

  fetchTranslations: (request: FetchTranslationsRequest) => Promise<FetchTranslationsResponse>;

  login: (request: LoginRequest) => Promise<LoginResponse>;
  register: (request: RegisterRequest) => Promise<RegisterResponse>;
  verifyToken: () => Promise<VerifyTokenResponse>;
  refreshToken: () => Promise<RefreshTokenResponse>;
  logout: () => Promise<LogoutResponse>;

  fetchUser: () => Promise<FetchUserResponse>;
  updateProfile: (request: UpdateProfileRequest) => Promise<UpdateProfileResponse>;

  fetchCurrencies: () => Promise<FetchCurrenciesResponse>;

  fetchBills: (request: FetchBillRequest) => Promise<FetchBillsResponse>;
  addBill: (request: AddBillRequest) => Promise<AddBillResponse>;
  uploadBillIcon: (request: UploadBillIconRequest) => Promise<UploadBillIconResponse>;
  updateBill: (request: UpdateBillRequest) => Promise<UpdateBillResponse>;
  reorderBills: (request: ReorderBillsRequest) => Promise<ReorderBillsResponse>;
  deleteBill: (request: DeleteBillRequest) => Promise<DeleteBillResponse>;
  addExpense: (request: AddExpenseRequest) => Promise<AddExpenseResponse>;

  fetchBillTransaction: (request: FetchBillTransactionsRequest) => Promise<FetchBillTransactionsResponse>;
  fetchTotalSum: (request: FetchTotalSumRequest) => Promise<FetchTotalSumResponse>;

  fetchCategories: (request: FetchCategoriesRequest) => Promise<FetchCategoriesResponse>;
  fetchSubcategories: (request: FetchSubcategoriesRequest) => Promise<FetchSubcategoriesResponse>;
  addCategory: (request: AddCategoryRequest) => Promise<AddCategoryResponse>;
  addSubcategory: (request: AddSubcategoryRequest) => Promise<AddSubcategoryResponse>;

  fetchUnits: () => Promise<FetchUnitsResponse>;
}
function createApi(): Api {
  const apiUrl = 'http://localhost:8000/api';

  return {
    userId,
    accessToken,

    fetchTranslations: createFetchTranslationsFunction(apiUrl),

    login: createLoginFunction(apiUrl),
    register: createRegisterFunction(apiUrl),
    verifyToken: createVerifyTokenFunction(apiUrl),
    refreshToken: createRefreshTokenFunction(apiUrl),
    logout: createLogoutFunction(apiUrl),

    fetchUser: createFetchUserFunction(apiUrl),
    updateProfile: createUpdateProfileFunction(apiUrl),

    fetchCurrencies: createFetchCurrenciesFunction(apiUrl),

    fetchBills: createFetchBillsFunction(apiUrl),
    addBill: createAddBillFunction(apiUrl),
    uploadBillIcon: createUploadBillIconFunction(apiUrl),
    updateBill: createUpdateBillFunction(apiUrl),
    reorderBills: createReorderBillsFunction(apiUrl),
    deleteBill: createDeleteBillFunction(apiUrl),

    addExpense: createAddExpenseFunction(apiUrl),

    fetchBillTransaction: createFetchBillTransactionFunction(apiUrl),
    fetchTotalSum: createFetchTotalSumFunction(apiUrl),

    fetchCategories: createFetchCategoriesFunction(apiUrl),
    fetchSubcategories: createFetchSubcategoriesFunction(apiUrl),
    addCategory: createAddCategoryFunction(apiUrl),
    addSubcategory: createAddSubcategoryFunction(apiUrl),

    fetchUnits: createFetchUnitsFunction(apiUrl),
  };
}

export const api = createApi();
