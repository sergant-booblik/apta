<template>
  <div class="subheader">
    <div class="subheader-inner">
      <div class="menu">
        <div
          v-for="item in menu"
          :key="item"
          class="menu-item"
        >
          <router-link
            :to="`/${item}`"
            exact
            exact-active-class="menu-item-link--active"
            class="menu-item-link"
          >
            <component
              :is="`${item}-icon`"
            />
            {{ $t(`Menu.Item.${item}`) }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MenuIcon from "@/components/icons/menu";

const HeaderComponent = defineComponent({
  components: {
    ...MenuIcon,
  },
  setup() {
    const menu = [
      'accounts',
      'expenses',
      // 'incomes', 'credits', 'budget', 'reports',
    ];

    return {
      menu,
    };
  },
});

export default HeaderComponent;
</script>
