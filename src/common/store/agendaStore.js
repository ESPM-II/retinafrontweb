import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAgendaInfo = create(
  persist(
    (set) => ({
      pacienteInfo: null,
      fechaAgenda: null,
      setPacienteInfo: (data) => set(() => ({ pacienteInfo: data })),
      setFechaAgenda: (data) => set(() => ({ fechaAgenda: data })),
    }),
    {
      name: 'agendaPaciente',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAgendaInfo;
