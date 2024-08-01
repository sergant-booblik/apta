import { defineStore } from 'pinia';
import { api } from '@/api';

type Translation = Record<string, string>;
interface TranslationState {
  translations: Translation | undefined;
}

export const useTranslationStore = defineStore('translation', {
  state: (): TranslationState => ({
    translations: undefined,
  }),
  actions: {
    async fetchTranslation(lang: string,) {
      return new Promise((resolve, reject) => {
        api.fetchTranslation({ lang })
          .then((response) => {
            this.translations = response;

            resolve(response);
          }).catch((error) => reject(error));
      });
    }
  },
});
