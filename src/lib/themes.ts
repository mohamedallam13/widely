export const THEMES = [
  { value: "noir",        label: "Noir",        swatch: ["#0A0A0A", "#DFF27E"] },
  { value: "neon",        label: "Neon",        swatch: ["#050505", "#C8FF00"] },
  { value: "midnight",    label: "Midnight",    swatch: ["#07090F", "#2D9FDB"] },
  { value: "bone",        label: "Bone",        swatch: ["#F5F1EA", "#B8472A"] },
  { value: "indigo_mist", label: "Indigo Mist", swatch: ["#C7D2FE", "#1E1B4B"] },
  { value: "sunset",      label: "Sunset",      swatch: ["#FFB199", "#3D1810"] },
  { value: "forest",      label: "Forest",      swatch: ["#BBF7D0", "#14532D"] },
  { value: "mono",        label: "Mono",        swatch: ["#FFFFFF", "#0A0A0A"] },
] as const;

export type ThemeValue = (typeof THEMES)[number]["value"];
