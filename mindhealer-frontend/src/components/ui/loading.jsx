import React from 'react';
import { cn } from "../../utils/ui";
import { Loader2 } from "lucide-react";

const Loading = ({ className, size = "default", text = "Loading..." }) => {
  const sizes = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className={cn("animate-spin", sizes[size], className)} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export { Loading };