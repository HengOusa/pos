import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * @typedef {Object} Config
 * @property {any[] | null} categories
 * @property {any[] | null} roles
 * @property {any[] | null} suppliers
 * @property {string[]} purchase_status
 */

/**
 * Zustand store for app-wide state management.
 */
export const configStore = create(
  persist(
    (set) => ({
      // -------------------------
      // STATE
      // -------------------------
      count: 1,
      profile: {},
      list: [],
      loading: false,
      config: {
        categories: null,
        roles: null,
        suppliers: null,
        brands: null,
        purchase_status: ["A", "A"],
      },

      // -------------------------
      // ACTIONS
      // -------------------------

      // Config actions
      setConfig: (params) => set({ config: params }),

      // Counter actions
      increase: (amount = 1) =>
        set((state) => ({ count: state.count + amount })),

      decrease: (amount = 1) =>
        set((state) => ({ count: Math.max(0, state.count - amount) })),
      
      resetCount: () => set({ count: 0 }),
      setCount: (value) => set({ count: Math.max(0, value) }),

      // Profile actions
      setProfile: (profileData) => set({ profile: profileData }),

      // List actions
      setList: (data) => set({ list: data }),
      addItem: (item) => set((state) => ({ list: [...state.list, item] })),
      removeItem: (index) =>
        set((state) => ({ list: state.list.filter((_, i) => i !== index) })),

      // Loading actions
      setLoading: (status) => set({ loading: status }),
    }),
    {
      name: "config-storage", // key in localStorage
      // Optional: define a partial whitelist to persist only some states
      // partialize: (state) => ({ count: state.count, config: state.config }),
    },
  ),
);
