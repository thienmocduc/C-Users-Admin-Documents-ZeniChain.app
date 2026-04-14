export { TRANSLATIONS, type Locale } from "./translations";

export const LANGUAGES = [
  { code: "VI" as const, name: "Tiếng Việt", flag: "\u{1F1FB}\u{1F1F3}" },
  { code: "EN" as const, name: "English", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "ZH" as const, name: "简体中文", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "JA" as const, name: "日本語", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "KO" as const, name: "한국어", flag: "\u{1F1F0}\u{1F1F7}" },
  { code: "TH" as const, name: "ภาษาไทย", flag: "\u{1F1F9}\u{1F1ED}" },
  { code: "ID" as const, name: "Bahasa Indonesia", flag: "\u{1F1EE}\u{1F1E9}" },
  { code: "MS" as const, name: "Bahasa Melayu", flag: "\u{1F1F2}\u{1F1FE}" },
  { code: "HI" as const, name: "हिन्दी", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "AR" as const, name: "العربية", flag: "\u{1F1F8}\u{1F1E6}" },
  { code: "KM" as const, name: "ភាសាខ្មែរ", flag: "\u{1F1F0}\u{1F1ED}" },
  { code: "LO" as const, name: "ພາສາລາວ", flag: "\u{1F1F1}\u{1F1E6}" },
];

export const DEFAULT_LOCALE = "VI" as const;
