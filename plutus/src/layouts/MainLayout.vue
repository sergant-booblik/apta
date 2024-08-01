<template>
  <div :class="{ 'main-layout--overlay': isOverlay }">
    <HeaderComponent />
    <SubheaderComponent />
    <div class="body">
      <RouterView />
    </div>
    <SidePanelComponent v-if="isSidePanelOpen" />
    <ModalComponent v-if="isModalOpen" />
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import { useSidePanelStore } from '@/store/side-panel';
import HeaderComponent from '@/components/HeaderComponent.vue';
import SubheaderComponent from '@/components/SubheaderComponent.vue';
import SidePanelComponent from '@/components/SidePanelComponent.vue';
import {storeToRefs} from "pinia";
import ModalComponent from "@/components/ModalComponent.vue";
import {useModalStore} from "@/store/modal";

const MainLayout = defineComponent({
  components: {
    ModalComponent,
    HeaderComponent,
    SubheaderComponent,
    SidePanelComponent,
  },
  setup() {
    const sidePanelStore = useSidePanelStore();
    const modalStore = useModalStore();

    const isSidePanelOpen = computed(() => sidePanelStore.type !== undefined);
    const isModalOpen = computed(() => modalStore.type !== undefined);

    const isOverlay = computed(() => isSidePanelOpen.value || isModalOpen.value);

    return {
      isOverlay,
      isSidePanelOpen,
      isModalOpen,
    };
  },
});

export default MainLayout;
</script>
