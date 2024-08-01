import { ref } from 'vue';
import { createAuthFunction } from '@/api/auth';
import { createFetchTranslationFunction } from '@/api/translation';
import { createFetchCurrenciesFunction } from '@/api/fetch-currencies';
import { createLoginFunction } from '@/api/login';
import { createFetchBillsFunction } from '@/api/fetch-bills';
import { createUpdateSettingsFunction } from '@/api/update-settings';
import { createAddBillFunction} from "@/api/add-bill";
import type { Ref } from 'vue';
import type { AuthResponse} from '@/api/auth';
import type { FetchTranslationRequest, FetchTranslationResponse } from '@/api/translation';
import type { LoginRequest, LoginResponse } from '@/api/login';
import type { FetchBillsRequest, FetchBillsResponse } from '@/api/fetch-bills';
import type { FetchCurrenciesResponse, FetchCurrenciesRequest } from '@/api/fetch-currencies';
import type { UpdateSettingsRequest, UpdateSettingsResponse} from '@/api/update-settings';
import type { AddBillRequest, AddBillResponse } from '@/api/add-bill';
import {
  createUploadBillIconFunction,
  type UploadBillIconRequest,
  type UploadBillIconResponse
} from '@/api/upload-bill-icon';

const userId = ref(0);
const accessToken = ref('');

interface Api {
  userId: Ref<number>;
  accessToken: Ref<string | undefined>;

  auth: () => Promise<AuthResponse>;
  login: (request: LoginRequest) => Promise<LoginResponse>;

  updateSettings: (request: UpdateSettingsRequest) => Promise<UpdateSettingsResponse>;

  fetchTranslation: (request: FetchTranslationRequest) => Promise<FetchTranslationResponse>;

  fetchCurrencies: (request: FetchCurrenciesRequest) => Promise<FetchCurrenciesResponse>;

  fetchBills: (request: FetchBillsRequest) => Promise<FetchBillsResponse>;
  addBill: (request: AddBillRequest) => Promise<AddBillResponse>;
  uploadBillIcon: (request: UploadBillIconRequest) => Promise<UploadBillIconResponse>;
}
function createApi(): Api {
  const apiUrl = 'http://localhost:8000/api';

  return {
    userId,
    accessToken,

    auth: createAuthFunction(apiUrl),
    login: createLoginFunction(apiUrl),

    updateSettings: createUpdateSettingsFunction(apiUrl),

    fetchTranslation: createFetchTranslationFunction(apiUrl),

    fetchCurrencies: createFetchCurrenciesFunction(apiUrl),

    fetchBills: createFetchBillsFunction(apiUrl),
    addBill: createAddBillFunction(apiUrl),
    uploadBillIcon: createUploadBillIconFunction(apiUrl),
  };
}

export const api = createApi();
