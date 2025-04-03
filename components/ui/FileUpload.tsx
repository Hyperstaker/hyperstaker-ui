import { forwardRef, useRef, useState } from "react";
import { FormControl } from "./FormControl";
import { FormLabel } from "./FormLabel";
import { FormHelperText } from "./FormHelperText";

interface FileUploadProps {
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  margin?: "none" | "normal" | "dense";
  accept?: string;
  onChange?: (file: File) => void;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    { label, error, helperText, fullWidth, margin = "none", accept, onChange }
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null); // {{ edit_1 }}

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setFileName(file.name);
        onChange?.(file);
      }
    };

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <FormControl fullWidth={fullWidth} margin={margin} error={error}>
        {label && <FormLabel>{label}</FormLabel>}
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={accept}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={handleClick}
            className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 focus:outline-none focus:border-blue-500"
          >
            {fileName ? fileName : "Click to upload or drag and drop"}
          </button>
        </div>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }
);

FileUpload.displayName = "FileUpload";
