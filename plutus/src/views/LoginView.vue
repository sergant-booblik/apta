<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-title">
        <Icon.LogoIcon />
        <h2 class="text-center">
          {{ $t('Auth.SignIn.title') }}
        </h2>
      </div>
      <form
        class="auth-card__form"
        @submit.prevent="login"
      >
        <div class="auth-card__inputs">
          <InputComponent
            v-model="email"
            :type="InputType.TEXT"
            :placeholder="t('Auth.SignIn.Email.placeholder')"
            :disabled="loading"
            :errors="errors?.email"
            class="mb-4"
          />
          <InputComponent
            v-model="password"
            :type="InputType.PASSWORD"
            :placeholder="t('Auth.SignIn.Password.placeholder')"
            :disabled="loading"
            :errors="errors?.password"
            class="mb-4"
          />
        </div>
        <ButtonComponent
          :label="$t('Auth.SignIn.Submit.button')"
          flex
          :type="ButtonType.SUBMIT"
          :disabled="loading"
          :append-icon="loading ? LoaderElement : undefined"
        />
      </form>
      <div class="auth-subline">
        <p>
          {{ $t('Auth.SignIn.Subline.text') }}
        </p>
        <router-link :to="{ name: RouteName.REGISTER }">
          {{ $t('Auth.SignIn.Subline.link') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import InputComponent from '@/components/InputComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { storeToRefs } from 'pinia';
import { RouteName } from '@/router';
import Icon from '@/components/icons';
import { useRouter } from 'vue-router';
import { ButtonType, InputType } from '@/types/controllers';
import { useI18n } from 'vue-i18n';
import LoaderElement from '@/components/elements/LoaderElement.vue';

const router = useRouter();
const authStore = useAuthStore();
const { errors, loading } = storeToRefs(authStore);

const { t } = useI18n();

const email = ref('');
const password = ref('');

const login = (): void => {
  authStore.login(email.value, password.value)
    .then(() => {
      router.push({ name: RouteName.HOME });
    });
};

watch([email, password], () => {
  authStore.clearError();
});

onUnmounted(() => {
  authStore.clearError();
});
</script>

<style scoped lang="scss" src="scss/views/auth.scss" />