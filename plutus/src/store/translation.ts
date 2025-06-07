import { defineStore } from 'pinia';
import { api } from '@/api';
import type { Translations } from '@/types/locale';

export interface TranslationState {
  translation: Translations | undefined,
}

export const useTranslationStore = defineStore('translation', {
  state: (): TranslationState => ({
    translation: undefined,
  }),
  actions: {
    async fetchTranslations(lang: string) {
      return new Promise((resolve, reject) => {
        api.fetchTranslations({ lang })
          .then((response) => {
            this.translation = response;
            resolve(response);
          }).catch((error) => reject(error));
      });
    },
  },
});
