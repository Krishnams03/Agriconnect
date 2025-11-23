// src/components/ui/toast.ts
import { toast as toastLib } from 'react-toastify'; // If using react-toastify or another library

// Extend the variant to include 'default'
export const toast = ({
  title,
  description,
  variant = 'success', // Default to 'success' if no variant is provided
}: {
  title: string;
  description: string;
  variant?: 'success' | 'destructive' | 'default'; // Added 'default'
}) => {
  const message = `${title}: ${description}`;

  // Handle different variants with custom logic
  switch (variant) {
    case 'destructive':
      toastLib.error(message); // For error toast (destructive)
      break;
    case 'default':
      toastLib.info(message); // For informational toast (default)
      break;
    case 'success':
    default:
      toastLib.success(message); // For success toast
      break;
  }
};
