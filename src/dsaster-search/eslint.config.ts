import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import eslintNestJs from "@darraghor/eslint-plugin-nestjs-typed";

const backwardsRelativeImports = {
  group: ["**/../**"],
  message:
    "Backwards relative imports should not be used. Use path aliases instead.",
};

const frameworkImports = {
  group: ["@nestjs/*", "class-validator", "class-transformer"],
  message:
    "Domain and application layers must not depend on frameworks. Keep them in presentation or infrastructure.",
};

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
        { patterns: [backwardsRelativeImports] },
      ],
      "sonarjs/todo-tag": "warn",
    },
  },
  {
    files: ["src/**/domain/**/*.ts"],
    ignores: ["**/*.spec.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            backwardsRelativeImports,
            frameworkImports,
            {
              group: [
                "**/application/**",
                "**/infrastructure/**",
                "**/presentation/**",
              ],
              message: "The domain layer must not depend on outer layers.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/application/**/*.ts"],
    ignores: ["**/*.spec.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            backwardsRelativeImports,
            frameworkImports,
            {
              group: ["**/infrastructure/**", "**/presentation/**"],
              message:
                "The application layer must not depend on infrastructure or presentation.",
            },
          ],
        },
      ],
    },
  },
]);
