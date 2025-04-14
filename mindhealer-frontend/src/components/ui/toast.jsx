import React from "react";
import { cn } from "../../utils/ui";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const Toast = ({ 
  type = "default",
  title,
  message,
  onClose,
  className,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    error: <AlertCircle className="h-5 w-5 text-red-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
    default: null,
  };

  const variants = {
    success: "border-green-200 bg-green-50",
    error: "border-red-200 bg-red-50",
    info: "border-blue-200 bg-blue-50",
    default: "border-gray-200 bg-white",
  };

  return (
    <div
      className={cn(
        "fixed right-4 top-4 z-50 w-full max-w-sm overflow-hidden rounded-lg border p-4 shadow-lg animate-in slide-in-from-right",
        variants[type],
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {icons[type]}
        <div className="flex-1">
          {title && (
            <h3 className="font-medium text-gray-900">{title}</h3>
          )}
          {message && (
            <p className="mt-1 text-sm text-gray-600">{message}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="text-gray-500 hover:text-gray-900"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
};

export { Toast };