import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import eslintNestJs from "@darraghor/eslint-plugin-nestjs-typed";

export default defineConfig([
  globalIgnores(["dist/**"]),
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      sonarjs.configs.recommended,
      eslintNestJs.configs.flatRecommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/../**"],
              message:
                "Backwards relative imports should not be used. Use path aliases instead.",
            },
          ],
        },
      ],
      "sonarjs/todo-tag": "warn",
    },
  },
]);
