import { ref } from 'vue';
import { createRefreshTokenFunction, createVerifyTokenFunction } from '@/api/auth'
import { createFetchTranslationFunction } from '@/api/translation';
import { createFetchCurrenciesFunction } from '@/api/fetch-currencies';
import { createLoginFunction } from '@/api/login';
import { createFetchBillsFunction } from '@/api/fetch-bills';
import { createAddBillFunction} from "@/api/add-bill";
import { createUploadBillIconFunction } from '@/api/upload-bill-icon';
import { createFetchUserFunction } from '@/api/fetch-user'
import { createLogoutFunction } from '@/api/logout';
import { createUpdateProfileFunction } from '@/api/update-profile'
import type { Ref } from 'vue';
import type { VerifyTokenResponse, RefreshTokenResponse } from '@/api/auth';
import type { FetchTranslationRequest, FetchTranslationResponse } from '@/api/translation';
import type { LoginRequest, LoginResponse } from '@/api/login';
import type { FetchBillsResponse } from '@/api/fetch-bills';
import type { FetchCurrenciesResponse, FetchCurrenciesRequest } from '@/api/fetch-currencies';
import type { AddBillRequest, AddBillResponse } from '@/api/add-bill';
import type { UploadBillIconRequest, UploadBillIconResponse } from '@/api/upload-bill-icon';
import type { UpdateProfileRequest, UpdateProfileResponse } from '@/api/update-profile'
import type { FetchUserResponse } from '@/api/fetch-user'
import type { LogoutResponse } from '@/api/logout'
import { createDeleteBillFunction, type DeleteBillRequest, type DeleteBillResponse } from '@/api/delete-bill'
import { createUpdateBillFunction, type UpdateBillRequest, type UpdateBillResponse } from '@/api/update-bill'

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

  fetchBills: () => Promise<FetchBillsResponse>;
  addBill: (request: AddBillRequest) => Promise<AddBillResponse>;
  uploadBillIcon: (request: UploadBillIconRequest) => Promise<UploadBillIconResponse>;
  updateBill: (request: UpdateBillRequest) => Promise<UpdateBillResponse>;
  deleteBill: (request: DeleteBillRequest) => Promise<DeleteBillResponse>;
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
  };
}

export const api = createApi();
