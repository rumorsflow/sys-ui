import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type LoadedState = {
  data: unknown | undefined
  set: (data: unknown) => void
  unset: () => void
}

export const useLoaded = create<LoadedState>()(
  devtools((set) => ({
    data: undefined,
    set: (data: unknown) => set(() => ({ data })),
    unset: () => set(() => ({ data: undefined })),
  }))
)
