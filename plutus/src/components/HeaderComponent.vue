<template>
  <div class="header">
    <div class="header-inner">
      <div class="header-title">
        <LogoIcon />
        <h1>
          {{ inter('Application Name') }}
        </h1>
      </div>
      <div role="button">
        <VerticalDotsIcon />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import inter from '@/helpers/translation';
import Icon from "@/components/icons";

const HeaderComponent = defineComponent({
  components: {
    VerticalDotsIcon: Icon.VerticalDotsIcon,
    LogoIcon: Icon.LogoIcon,
  },
  setup() {
    return {
      inter,
    };
  },
});

export default HeaderComponent;
</script>
