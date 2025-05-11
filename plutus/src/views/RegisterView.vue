<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-title">
        <Icon.LogoIcon />
        <h2 class="text-center">
          {{ $t('Auth.SignUp.title') }}
        </h2>
      </div>
      <form
        class="auth-card__form"
        @submit.prevent="register"
      >
        <div class="auth-card__inputs">
          <InputComponent
            v-model="name"
            :type="InputType.TEXT"
            :placeholder="t('Auth.SignUp.Name.placeholder')"
            :disabled="loading"
            :errors="errors?.name"
            class="mb-4"
          />
          <InputComponent
            v-model="email"
            :type="InputType.TEXT"
            :placeholder="t('Auth.SignUp.Email.placeholder')"
            :disabled="loading"
            :errors="errors?.email"
            class="mb-4"
          />
          <InputComponent
            v-model="password"
            :type="InputType.PASSWORD"
            :placeholder="t('Auth.SignUp.Password.placeholder')"
            :disabled="loading"
            :errors="errors?.password"
            class="mb-4"
          />
        </div>
        <ButtonComponent
          :label="$t('Auth.SignUp.Submit.button')"
          flex
          :disabled="loading"
          :append-icon="loading ? LoaderElement : undefined"
          :type="ButtonType.SUBMIT"
        />
      </form>
      <div class="auth-subline">
        <p>
          {{ $t('Auth.SignUp.Subline.text') }}
        </p>
        <router-link :to="{ name: RouteName.LOGIN }">
          {{ $t('Auth.SignUp.Subline.link') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
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
const name = ref('');
const locale = computed(() => window.navigator.language);

const register = (): void => {
  authStore.register(email.value, password.value, name.value, locale.value)
    .then(() => {
      router.push({ name: RouteName.HOME });
    });
};

watch([email, password, name], () => {
  authStore.clearError();
});

onUnmounted(() => {
  authStore.clearError();
});
</script>

<style scoped lang="scss" src="scss/views/auth.scss" />