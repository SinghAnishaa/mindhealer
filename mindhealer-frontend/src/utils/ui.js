import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine Tailwind classes and handle conflicts
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format time string (e.g., "15:30")
export function formatTime(timeStr) {
  return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format date for display
export function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Get initials from a name
export function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Fade in animation classes
export const fadeInAnimationClass = "animate-fade-in";

// Slide up animation classes
export const slideUpAnimationClass = "animate-slide-up";

// Scale animation classes
export const scaleAnimationClass = "animate-scale";

// Transition classes
export const transitionClasses = {
  fast: "transition-all duration-150 ease-in-out",
  default: "transition-all duration-300 ease-in-out",
  slow: "transition-all duration-500 ease-in-out",
};

// Common button variants
export const buttonVariants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "hover:bg-gray-100 text-gray-600 hover:text-gray-900",
};

// Common layout spacing
export const spacing = {
  section: "py-12",
  container: "px-4 sm:px-6 lg:px-8",
  stack: "space-y-4",
  cluster: "space-x-4",
};

// Shadow variants
export const shadows = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

// Common border radius
export const borderRadius = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

// Color palette
export const colors = {
  primary: {
    light: "bg-blue-50 text-blue-600",
    default: "bg-blue-600 text-white",
    dark: "bg-blue-700 text-white",
  },
  success: {
    light: "bg-green-50 text-green-600",
    default: "bg-green-600 text-white",
    dark: "bg-green-700 text-white",
  },
  error: {
    light: "bg-red-50 text-red-600",
    default: "bg-red-600 text-white",
    dark: "bg-red-700 text-white",
  },
  warning: {
    light: "bg-yellow-50 text-yellow-600",
    default: "bg-yellow-600 text-white",
    dark: "bg-yellow-700 text-white",
  },
};