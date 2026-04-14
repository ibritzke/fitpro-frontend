export const lightTheme = {
  bg: {
    primary: "#ffffff",
    secondary: "#f5f5f5",
    tertiary: "#eeeeee",
    card: "#ffffff",
    sidebar: "#1a1a2e",
  },
  text: {
    primary: "#111111",
    secondary: "#555555",
    tertiary: "#888888",
    inverse: "#ffffff",
  },
  accent: {
    primary: "#7c3aed",
    secondary: "#6d28d9",
    success: "#059669",
    danger: "#dc2626",
    warning: "#d97706",
    info: "#2563eb",
  },
  border: {
    light: "#e5e5e5",
    medium: "#d4d4d4",
  },
  shadow: "0 1px 3px rgba(0,0,0,0.08)",
};

export const darkTheme = {
  bg: {
    primary: "#0f1115",
    secondary: "#161a22",
    card: "#1c2230",
    sidebar: "#10131a",
    tertiary: "#0b0e14",
  },
  text: {
    primary: "#f1f5f9",
    secondary: "#cbd5e1",
    tertiary: "#94a3b8",

    inverse: "#111111",
  },
  accent: {
    primary: "#7c3aed",
    secondary: "#6d28d9",
    success: "#059669",
    danger: "#dc2626",
    warning: "#d97706",
    info: "#2563eb",
  },
  border: {
    light: "#2a2a2a",
    medium: "#333333",
  },
  shadow: "0 1px 3px rgba(0,0,0,0.4)",
};

export type Theme = typeof lightTheme;
