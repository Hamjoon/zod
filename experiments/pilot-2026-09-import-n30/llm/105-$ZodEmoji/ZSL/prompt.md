As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named $ZodEmoji. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The $ZodEmoji class is exported from `./schemas.js` (path relative to the test file).
Here is the $ZodEmoji class:
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