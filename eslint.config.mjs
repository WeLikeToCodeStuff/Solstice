import globals from "globals";
import eslint from "@eslint/js";
import stylisticTs from '@stylistic/eslint-plugin-ts'
import tseslint from "typescript-eslint";

/** @type { import("eslint").Linter.Config[] } */
export default tseslint.config(
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { ignores: ["dist/*"] },
    { languageOptions: { globals: globals.node } },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            '@stylistic/ts': stylisticTs,
        },
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@stylistic/ts/indent': ['error', 4],
            "no-lonely-if": "error",
            "no-multi-spaces": "error",
            "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
            "no-shadow": ["off", { "allow": ["err", "resolve", "reject"] }],
            "no-trailing-spaces": ["error"],
            "arrow-spacing": ["warn", { "before": true, "after": true }],
            "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
            "comma-dangle": ["error", "always-multiline"],
            "comma-spacing": "error",
            "comma-style": "error",
        },
    },
);