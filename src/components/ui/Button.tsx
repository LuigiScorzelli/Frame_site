import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "gradient";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variants = {
  primary: "bg-accent text-bg-0 hover:brightness-110 hover:shadow-lg hover:shadow-accent/20",
  secondary: "border border-text-0 text-text-0 hover:border-accent hover:text-accent",
  gradient: "text-bg-0 hover:shadow-lg hover:shadow-accent/30",
};

const sizes = {
  sm: "px-4 py-2 text-[10px]",
  md: "px-6 py-3 text-[11px]",
  lg: "px-7 py-3.5 text-[11px]",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-mono font-bold tracking-wider transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-0",
    "disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className
  );

  const style = variant === "gradient"
    ? { background: "linear-gradient(135deg, #BFFF00, #00E5FF)", letterSpacing: "1px" }
    : { letterSpacing: "1px" };

  if (href) {
    return <Link href={href} className={classes} style={style}>{children}</Link>;
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} style={style}>
      {children}
    </button>
  );
}
