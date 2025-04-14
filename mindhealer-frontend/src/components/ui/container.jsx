import React from "react";
import { cn } from "../../utils/ui";

const Container = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mindhealer-container animate-in", className)}
    {...props}
  />
));

Container.displayName = "Container";

export { Container };