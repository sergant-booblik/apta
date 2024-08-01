<template>
  <div
    ref="sidePanelRef"
    class="side-panel"
  >
    <CloseIcon
      role="button"
      class="side-panel__close"
      @click="closeSidePanel()"
    />
    <component
      v-if="type"
      :is="`${type}-component`"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { useSidePanelStore } from '@/store/side-panel';
import SidePanel from '@/components/side-panel';
import Icon from "@/components/icons";

function closeSidePanel(): void {
  const sidePanelStore = useSidePanelStore();
  sidePanelStore.removeSidePanel();
}

const SidePanelComponent = defineComponent({
  components: {
    ...SidePanel,
    CloseIcon: Icon.CloseIcon,
  },
  setup() {
    const sidePanelStore = useSidePanelStore();
    const { type } = storeToRefs(sidePanelStore);

    const sidePanelRef = ref<HTMLElement>();

    onClickOutside(sidePanelRef, () => sidePanelStore.removeSidePanel());

    return {
      closeSidePanel,
      type,
      sidePanelRef,
    };
  },
});

export default SidePanelComponent;
</script>
