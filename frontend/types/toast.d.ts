// src/types/toast.d.ts
declare module "@/components/ui/toast" {
  type ToastVariant = "success" | "destructive" | "default";

  export interface ToastOptions {
    title: string;
    description: string;
    variant?: ToastVariant;
  }

  export const toast: (options: ToastOptions) => void;
}
