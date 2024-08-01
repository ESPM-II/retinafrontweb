import dayjs from 'dayjs';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


export const useWorklistStore = create(
  // TODO: hacerlo no persistente cando acabe desarrollo
  persist(
    (set) => ({
      rangoFecha: [dayjs(Date.now()), dayjs(Date.now())],
      profesional: null,
      setRangoFecha: (range) => set(() => ({
        rangoFecha: [dayjs(range[0]), dayjs(range[1])]
      })),
      setProfesional: (data) => set(() => ({ profesional: data})),
    }),
    {
      name: 'worklistFiltersStore',
      storage: createJSONStorage(() => sessionStorage),
    },
    1000
  )
);

export default useWorklistStore;
