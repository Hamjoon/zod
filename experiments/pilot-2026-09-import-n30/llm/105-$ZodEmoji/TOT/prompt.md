Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class. All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The $ZodEmoji class is exported from `./schemas.js` (path relative to the test file).
The TypeScript class is:
export interface $ZodEmojiDef extends $ZodStringFormatDef<"emoji"> {}

export interface $ZodEmojiInternals extends $ZodStringFormatInternals<"emoji"> {}

export interface $ZodEmoji extends $ZodType {
  _zod: $ZodEmojiInternals;
}

export const $ZodEmoji: core.$constructor<$ZodEmoji> = /*@__PURE__*/ core.$constructor(
  "$ZodEmoji",
  (inst, def): void => {
    def.pattern ??= regexes.emoji();
    $ZodStringFormat.init(inst, def);
  }
);
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file ($ZodEmoji.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##