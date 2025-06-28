import { useTheme } from "next-themes";
import {
  Toaster as Sonner,
  toast as sonnerToast,
  // type Toast as SonnerToast,
} from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        className: "fixed bottom-4 right-4",
      }}
      {...props}
    />
  );
};

// Define styled toast functions with appropriate colors
const toast = {
  // Base methods from sonnerToast
  ...sonnerToast,

  // Success toast - green
  success: (message: string) =>
    sonnerToast("Sucesso!", {
      description: message,
      unstyled: true,
      style: {
        backgroundColor: "#22c55e",
        color: "#ffffff",
        borderRadius: "8px",
        padding: "16px 20px",
        fontSize: "14px",
        fontWeight: "500",
        textAlign: "center",
        minHeight: "60px",
        width: "100%",
        maxWidth: "400px",
        cursor: "pointer",
        border: "none",
        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
      },
    }),

  // Error toast - red (for 5xx errors)
  error: (message: string) =>
    sonnerToast("Erro!", {
      description: message,
      unstyled: true,
      style: {
        backgroundColor: "#ef4444",
        color: "#ffffff",
        borderRadius: "8px",
        padding: "16px 20px",
        fontSize: "14px",
        fontWeight: "500",
        textAlign: "center",
        minHeight: "60px",
        width: "100%",
        maxWidth: "400px",
        cursor: "pointer",
        border: "none",
        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
      },
    }),

  // Warning toast - amber/orange (for 4xx errors)
  warning: (message: string) =>
    sonnerToast("Atenção!", {
      description: message,
      unstyled: true,
      style: {
        backgroundColor: "#f59e0b",
        color: "#ffffff",
        borderRadius: "8px",
        padding: "16px 20px",
        fontSize: "14px",
        fontWeight: "500",
        textAlign: "center",
        minHeight: "60px",
        width: "100%",
        maxWidth: "400px",
        cursor: "pointer",
        border: "none",
        boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
      },
    }),

  // Info toast - blue
  info: (message: string) =>
    sonnerToast("Informação!", {
      description: message,
      unstyled: true,
      style: {
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        borderRadius: "8px",
        padding: "16px 20px",
        fontSize: "14px",
        fontWeight: "500",
        textAlign: "center",
        minHeight: "60px",
        width: "100%",
        maxWidth: "400px",
        cursor: "pointer",
        border: "none",
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
      },
    }),
};

export { Toaster, toast };
