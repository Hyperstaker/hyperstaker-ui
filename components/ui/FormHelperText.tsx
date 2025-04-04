import { forwardRef } from "react";

interface FormHelperTextProps {
  children: React.ReactNode;
}

export const FormHelperText = forwardRef<
  HTMLParagraphElement,
  FormHelperTextProps
>(({ children }, ref) => {
  return (
    <p ref={ref} className="mt-1 text-sm text-gray-500">
      {children}
    </p>
  );
});

FormHelperText.displayName = "FormHelperText";
