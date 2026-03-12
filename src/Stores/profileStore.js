import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useProfileStore = create()(
  persist(
    (set, get) => ({
      profile: null,
      access_token: null,
      permission: null,

      setProfile: (params) =>
        set(() => ({
          profile: params,
        })),

      logout: () =>
        set(() => ({
          profile: null,
          access_token: null,
          permission: null,
        })),

      setAccessToken: (params) =>
        set(() => ({
          access_token: params,
        })),

      setPermission: (params) =>
        set(() => ({
          permission: params,
        })),
    }),
    {
      name: "profile",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
