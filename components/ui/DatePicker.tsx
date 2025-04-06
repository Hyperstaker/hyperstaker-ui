import { forwardRef } from "react";
import { FormControl } from "./FormControl";
import { FormLabel } from "./FormLabel";
import { FormHelperText } from "./FormHelperText";

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  margin?: "none" | "normal" | "dense";
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, helperText, fullWidth, margin = "none", ...props }, ref) => {
    return (
      <FormControl fullWidth={fullWidth} margin={margin} error={error}>
        {label && <FormLabel>{label}</FormLabel>}
        <input
          type="date"
          ref={ref}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...props}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }
);

DatePicker.displayName = "DatePicker";
