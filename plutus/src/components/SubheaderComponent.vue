<template>
  <div class="subheader">
    <div class="subheader-inner">
      <div class="menu">
        <div
          v-for="(item, index) in menu"
          :key="index"
          class="menu-item"
        >
          <router-link
            :to="`/${item.name}`"
            exact
            exact-active-class="menu-item-link--active"
            class="menu-item-link"
          >
            <component
              :is="item.icon"
            />
            {{ t(`Menu.Item.${item}`) }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuIcon from "@/components/icons/menu";
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

const menu = [
  { name: 'accounts', icon: MenuIcon.AccountsIcon },
  { name: 'expenses', icon: MenuIcon.ExpensesIcon },
];
</script>
