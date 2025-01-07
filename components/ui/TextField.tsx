import { forwardRef } from "react";
import { Input } from "./Input";
import { FormControl } from "./FormControl";
import { FormLabel } from "./FormLabel";
import { FormHelperText } from "./FormHelperText";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  margin?: "none" | "normal" | "dense";
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth,
      margin = "none",
      multiline,
      rows = 1,
      ...props
    },
    ref
  ) => {
    return (
      <FormControl fullWidth={fullWidth} margin={margin} error={error}>
        {label && <FormLabel>{label}</FormLabel>}
        {multiline ? (
          <textarea
            ref={ref as any}
            rows={rows}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...props}
          />
        ) : (
          <Input ref={ref} {...props} />
        )}
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }
);

TextField.displayName = "TextField";
