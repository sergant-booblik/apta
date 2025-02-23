import { ref } from 'vue';
import type { Ref } from 'vue';
import { createRefreshTokenFunction, createVerifyTokenFunction } from '@/api/auth';
import { createFetchTranslationFunction } from '@/api/translation';
import { createFetchCurrenciesFunction } from '@/api/fetch-currencies';
import { createLoginFunction } from '@/api/login';
import { createFetchBillsFunction } from '@/api/fetch-bills'
import { createAddBillFunction} from "@/api/add-bill";
import { createUploadBillIconFunction } from '@/api/upload-bill-icon';
import { createFetchUserFunction } from '@/api/fetch-user'
import { createLogoutFunction } from '@/api/logout';
import { createUpdateProfileFunction } from '@/api/update-profile';
import { createDeleteBillFunction } from '@/api/delete-bill';
import { createUpdateBillFunction } from '@/api/update-bill';
import { createFetchBillTransactionFunction } from '@/api/fetch-bill-transactions';
import { createFetchTotalSumFunction } from '@/api/fetch-total-sum';
import type { VerifyTokenResponse, RefreshTokenResponse } from '@/api/auth';
import type { FetchTranslationRequest, FetchTranslationResponse } from '@/api/translation';
import type { LoginRequest, LoginResponse } from '@/api/login';
import type { FetchBillsResponse, FetchBillRequest } from '@/api/fetch-bills';
import type { FetchCurrenciesResponse, FetchCurrenciesRequest } from '@/api/fetch-currencies';
import type { AddBillRequest, AddBillResponse } from '@/api/add-bill';
import type { UploadBillIconRequest, UploadBillIconResponse } from '@/api/upload-bill-icon';
import type { UpdateProfileRequest, UpdateProfileResponse } from '@/api/update-profile'
import type { FetchUserResponse } from '@/api/fetch-user'
import type { LogoutResponse } from '@/api/logout'
import type { DeleteBillRequest, DeleteBillResponse } from '@/api/delete-bill';
import type { UpdateBillRequest, UpdateBillResponse } from '@/api/update-bill';
import type { FetchBillTransactionsRequest, FetchBillTransactionsResponse } from '@/api/fetch-bill-transactions';
import type { FetchTotalSumRequest, FetchTotalSumResponse } from '@/api/fetch-total-sum';

const userId = ref(0);
const accessToken = ref('');

interface Api {
  userId: Ref<number>;
  accessToken: Ref<string | undefined>;

  login: (request: LoginRequest) => Promise<LoginResponse>;
  verifyToken: () => Promise<VerifyTokenResponse>;
  refreshToken: () => Promise<RefreshTokenResponse>;
  logout: () => Promise<LogoutResponse>;

  fetchUser: () => Promise<FetchUserResponse>;
  updateProfile: (request: UpdateProfileRequest) => Promise<UpdateProfileResponse>;

  fetchTranslation: (request: FetchTranslationRequest) => Promise<FetchTranslationResponse>;

  fetchCurrencies: (request: FetchCurrenciesRequest) => Promise<FetchCurrenciesResponse>;

  fetchBills: (request: FetchBillRequest) => Promise<FetchBillsResponse>;
  addBill: (request: AddBillRequest) => Promise<AddBillResponse>;
  uploadBillIcon: (request: UploadBillIconRequest) => Promise<UploadBillIconResponse>;
  updateBill: (request: UpdateBillRequest) => Promise<UpdateBillResponse>;
  deleteBill: (request: DeleteBillRequest) => Promise<DeleteBillResponse>;

  fetchBillTransaction: (request: FetchBillTransactionsRequest) => Promise<FetchBillTransactionsResponse>;
  fetchTotalSum: (request: FetchTotalSumRequest) => Promise<FetchTotalSumResponse>;
}
function createApi(): Api {
  const apiUrl = 'http://localhost:8000/api';

  return {
    userId,
    accessToken,

    login: createLoginFunction(apiUrl),
    verifyToken: createVerifyTokenFunction(apiUrl),
    refreshToken: createRefreshTokenFunction(apiUrl),
    logout: createLogoutFunction(apiUrl),

    fetchUser: createFetchUserFunction(apiUrl),
    updateProfile: createUpdateProfileFunction(apiUrl),

    fetchTranslation: createFetchTranslationFunction(apiUrl),

    fetchCurrencies: createFetchCurrenciesFunction(apiUrl),

    fetchBills: createFetchBillsFunction(apiUrl),
    addBill: createAddBillFunction(apiUrl),
    uploadBillIcon: createUploadBillIconFunction(apiUrl),
    updateBill: createUpdateBillFunction(apiUrl),
    deleteBill: createDeleteBillFunction(apiUrl),

    fetchBillTransaction: createFetchBillTransactionFunction(apiUrl),
    fetchTotalSum: createFetchTotalSumFunction(apiUrl),
  };
}

export const api = createApi();
