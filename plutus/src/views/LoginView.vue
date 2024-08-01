<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-title">
        <h2 class="text-center">{{ inter('Auth.SignIn.title.part1') }}</h2>
        <LogoIcon />
        <h2 class="text-center">{{ inter('Auth.SignIn.title.part2') }}</h2>
      </div>
      <form
        class="auth-card__form"
        @submit.prevent="login"
      >
        <div class="auth-card__inputs">
          <InputComponent
            v-model="email"
            :placeholder="inter('Auth.Label.login')"
            class="mb-4"
          />
          <InputComponent
            v-model="password"
            type="password"
            :placeholder="inter('Auth.Label.password')"
            class="mb-4"
          />
          <p class="auth-card__error mb-4" v-if="error">
            {{ inter(error) }}
          </p>
        </div>
        <ButtonComponent
          :label="inter('Auth.Label.signIn')"
          flex
          type="submit"
        />
      </form>
      <div class="auth-subline">
        <p>
          {{ inter('Auth.SignIn.Subline.text') }}
        </p>
        <a href="/">
          {{ inter('Auth.SignIn.Subline.link') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type {Ref} from 'vue';
import {defineComponent, ref, watch} from 'vue';
import {useAuthStore} from '@/store/auth';
import inter from '@/helpers/translation';
import InputComponent from '@/components/InputComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { storeToRefs } from "pinia";
import router, { RouteName } from "@/router";
import Icon from "@/components/icons";
import { useRouter } from "vue-router";

const LoginView = defineComponent({
  components: {
    InputComponent,
    ButtonComponent,
    LogoIcon: Icon.LogoIcon,
  },
  beforeRouteEnter() {
    const authStore = useAuthStore();
    if (authStore.isAuth) {
      router.push({ name: RouteName.HOME });
    }
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const { error } = storeToRefs(authStore);

    const email = ref('');
    const password = ref('');

    const login = () => {
      authStore.login(email.value, password.value)
        .then(() => {
          router.push({ name: RouteName.HOME });
        });
    };

    watch([email, password], () => {
      authStore.clearError();
    });


    return {
      inter,
      email,
      password,
      login,
      error,
    };
  },
});

export default LoginView;
</script>
