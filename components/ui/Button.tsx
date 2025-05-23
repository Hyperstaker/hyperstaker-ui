import { tv } from "tailwind-variants";
import { createComponent } from ".";
import { type ComponentPropsWithRef, createElement, forwardRef } from "react";

const button = tv({
  base: "inline-flex items-center justify-center font-semibold text-center transition-colors rounded-full duration-150 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:ring-offset-gray-800",
  variants: {
    variant: {
      primary:
        "bg-primary-600 hover:bg-primary-700 dark:bg-white dark:hover:bg-primary-500 dark:text-gray-900 text-white dark:disabled:bg-gray-500",
      ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
      default:
        "bg-gray-700 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-800 active:bg-gray-800",
      inverted: "bg-white text-black hover:bg-white/90",
      link: "bg-none hover:underline",
    },
    size: {
      sm: "px-3 py-2 h-10 min-w-[40px]",
      deafult: "px-4 py-2 h-12",
      icon: "h-12 w-12",
    },
    disabled: {
      true: "text-gray-400 pointer-events-none pointer-default opacity-50 border-none",
    },
  },

  defaultVariants: {
    variant: "default",
    size: "deafult",
  },
});

export const Button = createComponent("button", button);

export const IconButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithRef<typeof Button> & {
    icon: React.ElementType;
    size?: string;
  }
>(function IconButton({ children, icon, size, ...props }, ref) {
  return (
    <Button ref={ref} {...props} size={children ? size : "icon"}>
      {icon
        ? createElement(icon, {
            className: `w-4 h-4 ${children ? "mr-2" : ""}`,
          })
        : null}
      {children}
    </Button>
  );
});
