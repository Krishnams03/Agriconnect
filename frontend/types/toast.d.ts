// src/types/toast.d.ts
declare module "@/components/ui/toast" {
    export const toast: (options: { title: string; description: string; variant?: 'success' | 'destructive' }) => void;
  }
  // In toast.d.ts or wherever you define the toast types
type ToastVariant = "success" | "destructive" | "default" | undefined;
