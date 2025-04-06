import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Heading = createComponent<"h1" | "h2" | "h3" | "h4" | "h5" | "h6", ReturnType<typeof tv>>(
  "h2",
  tv({
    base: "font-bold",
    variants: {
      size: {
        md: "text-base",
        lg: "text-lg mt-2 mb-1 ",
        xl: "text-xl ",
        "2xl": "text-2xl mt-8 mb-4 ",
        "3xl": "text-3xl mt-8 mb-4 ",
      },
    },
    defaultVariants: {
      size: "md",
    },
  })
);
