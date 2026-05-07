type LogoVariant = "light" | "dark";

type ShiftPlanMarkProps = {
  className?: string;
  size?: number;
  variant?: LogoVariant;
};

type ShiftPlanLogoProps = {
  className?: string;
  showSymbol?: boolean;
  variant?: LogoVariant;
};

const markColors = {
  light: {
    top: "#1557FF",
    middle: "#12BFAE",
    bottom: "#0B1220",
  },
  dark: {
    top: "#4B7BE5",
    middle: "#37A6A6",
    bottom: "#32465E",
  },
} satisfies Record<LogoVariant, Record<"top" | "middle" | "bottom", string>>;

const wordmarkColors = {
  light: "#0B1220",
  dark: "#FFFFFF",
} satisfies Record<LogoVariant, string>;

export function ShiftPlanMark({
  className,
  size = 40,
  variant = "light",
}: ShiftPlanMarkProps) {
  const colors = markColors[variant];

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 56 56"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.4 8H43.8C47.2 8 49.3 11.7 47.5 14.6L43.9 20.4C43.1 21.7 41.7 22.5 40.2 22.5H13.8C10.4 22.5 8.3 18.8 10.1 15.9L13.7 10.1C14.5 8.8 15.9 8 17.4 8Z"
        fill={colors.top}
      />
      <path
        d="M13.6 24.2H40C43.4 24.2 45.5 27.9 43.7 30.8L40.1 36.6C39.3 37.9 37.9 38.7 36.4 38.7H10C6.6 38.7 4.5 35 6.3 32.1L9.9 26.3C10.7 25 12.1 24.2 13.6 24.2Z"
        fill={colors.middle}
      />
      <path
        d="M20 40.4H46.4C49.8 40.4 51.9 44.1 50.1 47L46.5 52.8C45.7 54.1 44.3 54.9 42.8 54.9H16.4C13 54.9 10.9 51.2 12.7 48.3L16.3 42.5C17.1 41.2 18.5 40.4 20 40.4Z"
        fill={colors.bottom}
      />
    </svg>
  );
}

export function ShiftPlanLogo({
  className,
  showSymbol = true,
  variant = "light",
}: ShiftPlanLogoProps) {
  const wordmarkColor = wordmarkColors[variant];

  return (
    <span
      aria-label="ShiftPlan"
      className={["inline-flex items-center gap-3", className]
        .filter(Boolean)
        .join(" ")}
      role="img"
    >
      {showSymbol ? (
        <ShiftPlanMark className="shrink-0" size={42} variant={variant} />
      ) : null}
      <svg
        aria-hidden="true"
        className="h-8 w-auto"
        fill="none"
        viewBox="0 0 194 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          fill={wordmarkColor}
          fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontSize="34"
          y="31"
        >
          <tspan fontWeight="800">Shift</tspan>
          <tspan fontWeight="300">Plan</tspan>
        </text>
      </svg>
    </span>
  );
}
