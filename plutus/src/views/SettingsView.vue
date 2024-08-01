<template>
  Settings
  <br />
  <a
    role="button"
    @click="openSideMenu(SidePanelType.CURRENCIES)"
  >
    !Currencies!
  </a>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useSidePanelStore} from '@/store/side-panel';
import {SidePanelType} from "@/types/side-panel";

function openSideMenu(type: SidePanelType): void {
  const sidePanelStore = useSidePanelStore();
  sidePanelStore.setSidePanel(type);
}

const SettingsView = defineComponent({
  computed: {
    SidePanelType() {
      return SidePanelType;
    }
  },
  setup() {
    return {
      openSideMenu
    };
  },
});

export default SettingsView;
</script>
