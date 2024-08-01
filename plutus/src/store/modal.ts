import { defineStore } from 'pinia';
import type { ModalType } from '@/types/modal';

interface ModalState {
  type: ModalType | undefined,
  id: number | string | undefined,
}

export const useModalStore = defineStore('modal', {
  state: (): ModalState => ({
    type: undefined,
    id: undefined,
  }),
  actions: {
    setModal(type: ModalType, id?: number | string) {
      this.type = type;
      this.id = id;
    },
    removeModal() {
      this.type = undefined;
      this.id = undefined;
    },
  },
});
