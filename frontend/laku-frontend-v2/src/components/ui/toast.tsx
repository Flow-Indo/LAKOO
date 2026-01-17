import { toast } from 'sonner';

// Toast utility functions for consistent notifications
export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  warning: (message: string) => toast.warning(message),
  info: (message: string) => toast.info(message),
};

// Custom toast with action
export const showToastWithAction = (
  message: string,
  action: { label: string; onClick: () => void }
) => {
  return toast(message, {
    action: {
      label: action.label,
      onClick: action.onClick,
    },
  });
};

// Promise toast for async operations
export const showPromiseToast = (
  promise: Promise<unknown>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};