"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FormSubmitProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "lg" | "inline";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "gray"
    | "primary";
}

export const FormSubmit = ({
  children,
  disabled,
  className,
  variant = "primary",
  size = "sm",
}: FormSubmitProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending || disabled}
      type="submit"
      variant={variant}
      className={cn(className)}
      size={size}
    >
      {children}
    </Button>
  );
};
