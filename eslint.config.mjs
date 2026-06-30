import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Straight quotes/apostrophes in JSX text render correctly as-is;
      // this rule is purely stylistic and the copy-heavy pages here use
      // plenty of contractions and quoted phrases.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
