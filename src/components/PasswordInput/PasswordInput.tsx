import { type ComponentProps, useState } from "react";

import { Eye, EyeOff, Lock } from "lucide-react";
import type { FieldError } from "react-hook-form";

import { Input } from "@/components/ui";

export const PasswordInput = ({
  defaultShowPassword = false,
  error,
  ...fieldProps
}: {
  defaultShowPassword?: boolean;
  error?: FieldError;
} & ComponentProps<typeof Input>) => {
  const [showPassword, setShowPassword] = useState(defaultShowPassword);

  return (
    <div className="relative">
      <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        className={`pl-10 ${error ? "border-red-500" : ""}`}
        placeholder="Enter password"
        {...fieldProps}
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
      />
      <button
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
        type="button"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};
