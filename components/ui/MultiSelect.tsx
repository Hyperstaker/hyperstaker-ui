import { forwardRef, useState } from "react";
import { FormControl } from "./FormControl";
import { FormLabel } from "./FormLabel";
import { FormHelperText } from "./FormHelperText";

interface MultiSelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "value" | "onChange"
  > {
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  margin?: "none" | "normal" | "dense";
  options: string[];
  freeSolo?: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export const MultiSelect = forwardRef<HTMLSelectElement, MultiSelectProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth,
      margin = "none",
      options,
      freeSolo,
      value = [],
      onChange,
      ...props
    },
    ref
  ) => {
    const [customOption, setCustomOption] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      onChange?.(selectedOptions);
    };

    const handleCustomOptionAdd = () => {
      if (customOption && !value.includes(customOption)) {
        onChange?.([...value, customOption]);
        setCustomOption("");
      }
    };

    return (
      <FormControl fullWidth={fullWidth} margin={margin} error={error}>
        {label && <FormLabel>{label}</FormLabel>}
        <select
          ref={ref}
          multiple
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {freeSolo && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={customOption}
              onChange={(e) => setCustomOption(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
              placeholder="Add custom option"
            />
            <button
              type="button"
              onClick={handleCustomOptionAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add
            </button>
          </div>
        )}
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
