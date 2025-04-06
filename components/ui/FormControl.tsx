import { forwardRef } from "react";

interface FormControlProps {
  children: React.ReactNode;
  error?: boolean;
  fullWidth?: boolean;
  margin?: "none" | "normal" | "dense";
}

export const FormControl = forwardRef<HTMLDivElement, FormControlProps>(
  ({ children, error, fullWidth, margin = "none" }, ref) => {
    const marginClass = {
      none: "",
      normal: "my-4",
      dense: "my-2",
    }[margin];

    return (
      <div
        ref={ref}
        className={`
          ${fullWidth ? "w-full" : ""}
          ${marginClass}
          ${error ? "text-red-500" : ""}
        `}
      >
        {children}
      </div>
    );
  }
);

FormControl.displayName = "FormControl";
