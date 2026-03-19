/**
 * Omega (Ω) icon — used for favicon, OG image, and branding.
 * Renders an Ω glyph in a rounded square. Color inherits from parent via currentColor.
 */
export const OmegaIcon = ({ size = 120, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="120" height="120" rx="26" fill="currentColor" />
    <text
      x="60"
      y="92"
      textAnchor="middle"
      fontFamily="Georgia, 'Times New Roman', serif"
      fontSize="88"
      fontWeight="bold"
      fill="white"
    >
      Ω
    </text>
  </svg>
);
