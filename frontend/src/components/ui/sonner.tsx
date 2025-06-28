import { useTheme } from "next-themes";
import {
  Toaster as Sonner,
  toast as sonnerToast,
  
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


const toast = {
  
  ...sonnerToast,

  
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
