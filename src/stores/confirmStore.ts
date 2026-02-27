import { create } from "zustand";

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

interface ConfirmState {
  dialog: ConfirmDialogOptions | null;
  confirm: (options: ConfirmDialogOptions) => void;
  close: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  dialog: null,

  confirm: (options) => {
    set({ dialog: options });
  },

  close: () => {
    set({ dialog: null });
  },
}));
