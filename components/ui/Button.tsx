import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "accent";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark focus-visible:outline-brand",
  secondary:
    "bg-paper-raised text-ink-soft border border-line hover:border-brand/40 hover:text-ink focus-visible:outline-brand",
  ghost: "bg-transparent text-ink-soft hover:bg-brand-light hover:text-brand-dark focus-visible:outline-brand",
  accent: "bg-accent text-white hover:bg-accent-dark focus-visible:outline-accent",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
