import { defineStore } from 'pinia';
import { SidePanelType } from '@/types/side-panel';

interface SidePanelState {
  type: SidePanelType | undefined,
  id: number | undefined,

}

export const useSidePanelStore = defineStore('side-panel', {
  state: (): SidePanelState => ({
    type: undefined,
    id: undefined,
  }),
  actions: {
    setSidePanel(type: SidePanelType, id?: number) {
      this.type = type;
      this.id = id;
    },
    removeSidePanel() {
      this.type = undefined;
      this.id = undefined;
    },
  },
});
