export const colors = {
  primary: "#102F63",
  primaryDark: "#0B234A",
  primaryLight: "#E8F0FA",

  secondary: "#1D4E89",

  background: "#F1F5F9",
  backgroundSecondary: "#F8FAFC",
  surface: "#FFFFFF",

  text: "#0F172A",
  textSecondary: "#64748B",
  textInverse: "#FFFFFF",

  border: "#E2E8F0",
  placeholder: "#94A3B8",

  success: "#16A34A",
  successDark: "#15803D",
  successDarker: "#166534",
  successLight: "#DCFCE7",
  successSurface: "#ECFDF5",
  successBorder: "#BBF7D0",

  warning: "#F59E0B",
  warningDark: "#C2410C",
  warningLight: "#FFF7ED",

  danger: "#DC2626",
  dangerDark: "#B91C1C",
  dangerLight: "#FEE2E2",

  info: "#2563EB",
  infoLight: "#EFF6FF",

  disabled: "#CBD5E1",

  overlay: "rgba(15, 23, 42, 0.5)",

  infoSoft: "#DBEAFE",
  warningStrong: "#EA580C",
  warningSoft: "#FFEDD5",

  dangerBorder: "#FECACA",
  dangerSurface: "#FFF7F7",
} as const;

export type AppColors = typeof colors;
