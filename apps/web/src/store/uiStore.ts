import { create } from 'zustand'

type ModalMode = 'create' | 'view' | 'edit'

interface UIState {
  activeModal: 'book' | 'author' | null
  modalMode: ModalMode
  selectedId: string | null
  openBookModal: (mode: ModalMode, id?: string) => void
  openAuthorModal: (mode: ModalMode, id?: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  activeModal: null,
  modalMode: 'create',
  selectedId: null,

  openBookModal: (mode, id = undefined) =>
    set({ activeModal: 'book', modalMode: mode, selectedId: id }),

  openAuthorModal: (mode, id = undefined) =>
    set({ activeModal: 'author', modalMode: mode, selectedId: id }),

  closeModal: () =>
    set({ activeModal: null, selectedId: null }),
}))