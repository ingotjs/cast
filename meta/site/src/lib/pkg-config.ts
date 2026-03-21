export type PkgName = "cast" | "prospect";
export type PmName = "bun" | "npm" | "yarn" | "pnpm";

export const pkgConfig = {
  cast: {
    npm: "https://www.npmjs.com/package/@ingot/cast",
    github: "https://github.com/ingotjs/cast",
  },
  prospect: {
    npm: "https://www.npmjs.com/package/@ingot/prospect",
    github: "https://github.com/ingotjs/cast/tree/main/packages/prospect",
  },
} as const;

export const pmCommands = {
  bun: { bin: "bun", args: "i -D @ingot/prospect" },
  npm: { bin: "npm", args: "i -D @ingot/prospect" },
  yarn: { bin: "yarn", args: "i -D @ingot/prospect" },
  pnpm: { bin: "pnpm", args: "i -D @ingot/prospect" },
} as const;

export const pmNames: PmName[] = ["bun", "npm", "yarn", "pnpm"];
