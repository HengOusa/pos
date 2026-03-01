import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// export const useProfileStore = create((set) => ({
//   // profile: {
//   //   id: null,
//   //   name: "Heng123",
//   //   email: "heng@gmail.com",
//   //   image: profile_img,
//   //   role: "admin",
//   //   permission: null,
//   // },

//   profile: null,
//   access_token: null,

//   setProfile: (params) =>
//     set((pre) => ({
//       profile: params,
//     })),
//   logout: (params) =>
//     set((pre) => ({
//       profile: null,
//     })),
//   setAccessToken: (params) =>
//     set((pre) => ({
//       access_token: params,
//     })),
// }));

export const useProfileStore = create()(
  persist(
    (set, get) => ({
      profile: null,
      access_token: null,
      permission: null,
      setProfile: (params) =>
        set((pre) => ({
          profile: params,
        })),
      logout: (params) =>
        set((pre) => ({
          profile: null,
        })),
      setAccessToken: (params) =>
        set((pre) => ({
          access_token: params,
        })),
      setPermission: (params) =>
        set((pre) => ({
          permission: params,
        })),
    }),
    {
      name: "profile", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
