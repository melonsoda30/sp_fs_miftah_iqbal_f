import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Textarea } from "./textarea";

interface DropdownItem {
  value: string;
  label: string;
}

interface BaseFieldProps {
  label: string;
  name: string;
  errors?: string[] | undefined;
  value?: string;
}

interface TextFieldProps extends BaseFieldProps {
  type: "text" | "email" | "password";
  dropdown?: never;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: "textarea";
  dropdown?: never;
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  dropdown: DropdownItem[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

type FieldProps = (TextFieldProps | TextareaFieldProps | SelectFieldProps) &
  Omit<React.ComponentProps<"input">, "type" | "name" | "value">;

export function Field({
  label,
  name,
  type,
  errors,
  value,
  dropdown,
  ...props
}: FieldProps) {
  const { placeholder, rows, onValueChange, ...restProps } = props as {
    placeholder?: string;
    rows?: number;
    onValueChange?: (value: string) => void;
    [key: string]: unknown;
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm tracking-wider" htmlFor={name}>
        {label}
      </label>
      {(type === "text" || type === "email" || type === "password") && (
        <Input
          name={name}
          type={type}
          value={value}
          aria-invalid={errors && errors?.length > 0}
          {...restProps}
        />
      )}
      {type === "textarea" && (
        <Textarea
          name={name}
          value={value}
          aria-invalid={errors && errors?.length > 0}
          placeholder={placeholder}
          rows={rows}
          {...restProps}
        />
      )}
      {type === "select" && dropdown && (
        <Select name={name} value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-full" aria-invalid={!!errors?.length}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {dropdown.map((item, i) => (
              <SelectItem key={i} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {errors && errors.length > 0 && (
        <div>
          {errors.map((val, i) => (
            <p key={i} className="text-xs text-destructive">
              {val}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
