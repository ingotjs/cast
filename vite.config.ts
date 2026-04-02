import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
    },
  },

  fmt: {
    ignorePatterns: [".agents", ".claude", "**/routeTree.gen.ts"],
    arrowParens: "always",
    bracketSameLine: false,
    bracketSpacing: true,
    endOfLine: "lf",
    experimentalSortImports: {
      ignoreCase: true,
      newlinesBetween: true,
      order: "asc",
    },
    experimentalSortPackageJson: true,
    jsxSingleQuote: false,
    printWidth: 120,
    quoteProps: "as-needed",
    semi: true,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "es5",
    useTabs: false,
  },
});
