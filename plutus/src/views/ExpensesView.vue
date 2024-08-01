<template>
  <div class="body__header">
    <h1>{{ inter('Expenses') }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import inter from '../helpers/translation';

const BillsView = defineComponent({
  setup() {
    return {
      inter,
    };
  },
});

export default BillsView;
</script>
