import create from "zustand";
import { persist } from "zustand/middleware";

export const useGradesStore = create(
  persist(
    (set) => ({
      gradesData: "",
      setGradesData: (data) =>
        set((state) => {
          state.gradesData = data;
        }),

      clearGradesData() {
        set({ gradesData: "" });
      },
    }),
    {
      name: "grades-data",
    }
  )
);

export const useCredsStore = create(
  persist(
    (set) => ({
      setCreds: (data) => {
        set((state) => {
          state.username = data.username;
          state.password = data.password;
        });
      },

      clearCreds() {
        set({ username: "", password: "" });
      },
    }),
    {
      name: "creds",
      // getStorage: () => sessionStorage,
    }
  )
);
