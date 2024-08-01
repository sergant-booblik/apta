<template>
  <div class="card">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const CardComponent = defineComponent({});

export default CardComponent;
</script>
