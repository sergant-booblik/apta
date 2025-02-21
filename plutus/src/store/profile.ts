import { defineStore } from 'pinia';
import { api } from '@/api';
import type { Profile } from '@/types/profile';
import type { FetchUserResponse } from '@/api/fetch-user'
import type { UpdateProfileResponse } from '@/api/update-profile'

interface ProfileState {
  profile: Profile | undefined,
  loading: boolean,
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: undefined,
    loading: false,
  }),
  actions: {
   setProfile(profile: Profile) {
      this.profile = profile;
    },
    async fetchUser(): Promise<FetchUserResponse> {
     return new Promise((resolve, reject) => {
       api.fetchUser()
         .then((response) => {
           this.setProfile(response.profile);

           resolve(response);
         }).catch((error) => reject(error))
         .finally(() => {
           this.loading = false;
         });
     })
    },
    async updateProfile(profile: Profile) {
      return new Promise<UpdateProfileResponse>((resolve, reject) => {
        api.updateProfile({ profile })
          .then((response) => {
            this.setProfile(response.profile);

            resolve(response);
          }).catch((error) => reject(error))
          .finally(() => {
            this.loading = false;
          });
      });
    },
    clearUser() {
      this.profile = undefined;
    },
  },
});
