import { forwardRef } from "react";

interface FormLabelProps {
  children: React.ReactNode;
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ children }, ref) => {
    return (
      <label ref={ref} className="block mb-2 text-sm font-medium text-gray-400">
        {children}
      </label>
    );
  }
);

FormLabel.displayName = "FormLabel";
