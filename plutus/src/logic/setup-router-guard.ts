import type { Router } from 'vue-router';
import type { Pinia } from 'pinia';
import { useAuthStore } from '@/store/auth';
import { useProfileStore } from '@/store/profile';
import { RouteName } from '@/router';

export function setupRouterGuard(router: Router, pinia: Pinia) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore(pinia);
    const profileStore = useProfileStore(pinia);

    if (to.matched.some((record) => record.meta.auth)) {
      try {
        const verifyResult = await authStore.verifyToken();

        if (verifyResult.success) {
          if (!profileStore.profile) {
            await profileStore.fetchUser();
          }
          return next();
        }

        const refreshResult = await authStore.refreshToken();
        if (refreshResult.success) {
          if (!profileStore.profile) {
            await profileStore.fetchUser();
          }
          return next();
        }

        await authStore.logout(router);
        return next({ name: RouteName.LOGIN });

      } catch {
        await authStore.logout(router);
        return next({ name: RouteName.LOGIN });
      }
    } else {
      const verifyResult = await authStore.verifyToken();
      if (verifyResult.success && (to.name === RouteName.LOGIN || to.name === RouteName.REGISTER)) {
        if (!profileStore.profile) {
          await profileStore.fetchUser();
        }
        return next({ name: RouteName.HOME });
      }
      return next();
    }
  });
}
