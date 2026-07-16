You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: packages/zod/src/v4/classic/schemas.ts, packages/zod/src/v4/core/api.ts, packages/zod/src/v4/core/schemas.ts, packages/zod/src/v4/mini/schemas.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/packages/zod/src/v4/classic/schemas.ts b/packages/zod/src/v4/classic/schemas.ts
index 6ef63cf97..8f49caeef 100644
--- a/packages/zod/src/v4/classic/schemas.ts
+++ b/packages/zod/src/v4/classic/schemas.ts
@@ -1215,11 +1215,13 @@ export function union<const T extends readonly core.SomeType[]>(
 }
 
 // ZodDiscriminatedUnion
-export interface ZodDiscriminatedUnion<Options extends readonly core.SomeType[] = readonly core.$ZodType[]>
-  extends ZodUnion<Options>,
-    core.$ZodDiscriminatedUnion<Options> {
-  _zod: core.$ZodDiscriminatedUnionInternals<Options>;
-  def: core.$ZodDiscriminatedUnionDef<Options>;
+export interface ZodDiscriminatedUnion<
+  Options extends readonly core.SomeType[] = readonly core.$ZodType[],
+  Disc extends string = string,
+> extends ZodUnion<Options>,
+    core.$ZodDiscriminatedUnion<Options, Disc> {
+  _zod: core.$ZodDiscriminatedUnionInternals<Options, Disc>;
+  def: core.$ZodDiscriminatedUnionDef<Options, Disc>;
 }
 export const ZodDiscriminatedUnion: core.$constructor<ZodDiscriminatedUnion> = /*@__PURE__*/ core.$constructor(
   "ZodDiscriminatedUnion",
@@ -1231,11 +1233,12 @@ export const ZodDiscriminatedUnion: core.$constructor<ZodDiscriminatedUnion> = /
 
 export function discriminatedUnion<
   Types extends readonly [core.$ZodTypeDiscriminable, ...core.$ZodTypeDiscriminable[]],
+  Disc extends string,
 >(
-  discriminator: string,
+  discriminator: Disc,
   options: Types,
   params?: string | core.$ZodDiscriminatedUnionParams
-): ZodDiscriminatedUnion<Types> {
+): ZodDiscriminatedUnion<Types, Disc> {
   // const [options, params] = args;
   return new ZodDiscriminatedUnion({
     type: "union",
diff --git a/packages/zod/src/v4/core/api.ts b/packages/zod/src/v4/core/api.ts
index 6447af97c..98d904775 100644
--- a/packages/zod/src/v4/core/api.ts
+++ b/packages/zod/src/v4/core/api.ts
@@ -1081,12 +1081,15 @@ export interface $ZodTypeDiscriminable extends schemas.$ZodType {
   _zod: $ZodTypeDiscriminableInternals;
 }
 export type $ZodDiscriminatedUnionParams = TypeParams<schemas.$ZodDiscriminatedUnion, "options" | "discriminator">;
-export function _discriminatedUnion<Types extends [$ZodTypeDiscriminable, ...$ZodTypeDiscriminable[]]>(
+export function _discriminatedUnion<
+  Types extends [$ZodTypeDiscriminable, ...$ZodTypeDiscriminable[]],
+  Disc extends string,
+>(
   Class: util.SchemaClass<schemas.$ZodDiscriminatedUnion>,
-  discriminator: string,
+  discriminator: Disc,
   options: Types,
   params?: string | $ZodDiscriminatedUnionParams
-): schemas.$ZodDiscriminatedUnion<Types> {
+): schemas.$ZodDiscriminatedUnion<Types, Disc> {
   return new Class({
     type: "union",
     options,
diff --git a/packages/zod/src/v4/core/schemas.ts b/packages/zod/src/v4/core/schemas.ts
index aa7aa2788..3f076e60e 100644
--- a/packages/zod/src/v4/core/schemas.ts
+++ b/packages/zod/src/v4/core/schemas.ts
@@ -2010,20 +2010,27 @@ export const $ZodUnion: core.$constructor<$ZodUnion> = /*@__PURE__*/ core.$const
 //////////////////////////////////////////////////////
 //////////////////////////////////////////////////////
 
-export interface $ZodDiscriminatedUnionDef<Options extends readonly SomeType[] = readonly $ZodType[]>
-  extends $ZodUnionDef<Options> {
-  discriminator: string;
+export interface $ZodDiscriminatedUnionDef<
+  Options extends readonly SomeType[] = readonly $ZodType[],
+  Disc extends string = string,
+> extends $ZodUnionDef<Options> {
+  discriminator: Disc;
   unionFallback?: boolean;
 }
 
-export interface $ZodDiscriminatedUnionInternals<Options extends readonly SomeType[] = readonly $ZodType[]>
-  extends $ZodUnionInternals<Options> {
-  def: $ZodDiscriminatedUnionDef<Options>;
+export interface $ZodDiscriminatedUnionInternals<
+  Options extends readonly SomeType[] = readonly $ZodType[],
+  Disc extends string = string,
+> extends $ZodUnionInternals<Options> {
+  def: $ZodDiscriminatedUnionDef<Options, Disc>;
   propValues: util.PropValues;
 }
 
-export interface $ZodDiscriminatedUnion<T extends readonly SomeType[] = readonly $ZodType[]> extends $ZodType {
-  _zod: $ZodDiscriminatedUnionInternals<T>;
+export interface $ZodDiscriminatedUnion<
+  Options extends readonly SomeType[] = readonly $ZodType[],
+  Disc extends string = string,
+> extends $ZodType {
+  _zod: $ZodDiscriminatedUnionInternals<Options, Disc>;
 }
 
 export const $ZodDiscriminatedUnion: core.$constructor<$ZodDiscriminatedUnion> =
diff --git a/packages/zod/src/v4/mini/schemas.ts b/packages/zod/src/v4/mini/schemas.ts
index b34adb258..f755ae72e 100644
--- a/packages/zod/src/v4/mini/schemas.ts
+++ b/packages/zod/src/v4/mini/schemas.ts
@@ -907,9 +907,11 @@ export function union<const T extends readonly SomeType[]>(
 }
 
 // ZodMiniDiscriminatedUnion
-export interface ZodMiniDiscriminatedUnion<Options extends readonly SomeType[] = readonly core.$ZodType[]>
-  extends ZodMiniUnion<Options> {
-  _zod: core.$ZodDiscriminatedUnionInternals<Options>;
+export interface ZodMiniDiscriminatedUnion<
+  Options extends readonly SomeType[] = readonly core.$ZodType[],
+  Disc extends string = string,
+> extends ZodMiniUnion<Options> {
+  _zod: core.$ZodDiscriminatedUnionInternals<Options, Disc>;
 }
 export const ZodMiniDiscriminatedUnion: core.$constructor<ZodMiniDiscriminatedUnion> = /*@__PURE__*/ core.$constructor(
   "ZodMiniDiscriminatedUnion",
@@ -921,17 +923,18 @@ export const ZodMiniDiscriminatedUnion: core.$constructor<ZodMiniDiscriminatedUn
 
 export function discriminatedUnion<
   Types extends readonly [core.$ZodTypeDiscriminable, ...core.$ZodTypeDiscriminable[]],
+  Disc extends string,
 >(
-  discriminator: string,
+  discriminator: Disc,
   options: Types,
   params?: string | core.$ZodDiscriminatedUnionParams
-): ZodMiniDiscriminatedUnion<Types> {
+): ZodMiniDiscriminatedUnion<Types, Disc> {
   return new ZodMiniDiscriminatedUnion({
     type: "union",
     options,
     discriminator,
     ...util.normalizeParams(params),
-  }) as ZodMiniDiscriminatedUnion<Types>;
+  }) as ZodMiniDiscriminatedUnion<Types, Disc>;
 }
 
 // ZodMiniIntersection

</recent_change_diff>

Current test results:
<test_output>
 Test Files  164 passed (164)
      Tests  1760 passed (1760)
   Duration  6.50s (transform 480ms, setup 0ms, collect 18.66s, tests 5.23s, environment 7ms, prepare 7.83s, typecheck 6.01s)

</test_output>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/classic/schemas.ts" lines="1193-1266">

// ZodUnion
export interface ZodUnion<T extends readonly core.SomeType[] = readonly core.$ZodType[]>
  extends _ZodType<core.$ZodUnionInternals<T>>,
    core.$ZodUnion<T> {
  options: T;
}
export const ZodUnion: core.$constructor<ZodUnion> = /*@__PURE__*/ core.$constructor("ZodUnion", (inst, def) => {
  core.$ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst.options = def.options;
});

export function union<const T extends readonly core.SomeType[]>(
  options: T,
  params?: string | core.$ZodUnionParams
): ZodUnion<T> {
  return new ZodUnion({
    type: "union",
    options: options as any as core.$ZodType[],
    ...util.normalizeParams(params),
  }) as any;
}

// ZodDiscriminatedUnion
export interface ZodDiscriminatedUnion<
  Options extends readonly core.SomeType[] = readonly core.$ZodType[],
  Disc extends string = string,
> extends ZodUnion<Options>,
    core.$ZodDiscriminatedUnion<Options, Disc> {
  _zod: core.$ZodDiscriminatedUnionInternals<Options, Disc>;
  def: core.$ZodDiscriminatedUnionDef<Options, Disc>;
}
export const ZodDiscriminatedUnion: core.$constructor<ZodDiscriminatedUnion> = /*@__PURE__*/ core.$constructor(
  "ZodDiscriminatedUnion",
  (inst, def) => {
    ZodUnion.init(inst, def);
    core.$ZodDiscriminatedUnion.init(inst, def);
  }
);

export function discriminatedUnion<
  Types extends readonly [core.$ZodTypeDiscriminable, ...core.$ZodTypeDiscriminable[]],
  Disc extends string,
>(
  discriminator: Disc,
  options: Types,
  params?: string | core.$ZodDiscriminatedUnionParams
): ZodDiscriminatedUnion<Types, Disc> {
  // const [options, params] = args;
  return new ZodDiscriminatedUnion({
    type: "union",
    options,
    discriminator,
    ...util.normalizeParams(params),
  }) as any;
}

// ZodIntersection
export interface ZodIntersection<A extends core.SomeType = core.$ZodType, B extends core.SomeType = core.$ZodType>
  extends _ZodType<core.$ZodIntersectionInternals<A, B>>,
    core.$ZodIntersection<A, B> {}
export const ZodIntersection: core.$constructor<ZodIntersection> = /*@__PURE__*/ core.$constructor(
  "ZodIntersection",
  (inst, def) => {
    core.$ZodIntersection.init(inst, def);
    ZodType.init(inst, def);
  }
);

export function intersection<T extends core.SomeType, U extends core.SomeType>(
  left: T,
  right: U
): ZodIntersection<T, U> {
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/api.ts" lines="1059-1117">
export type $ZodObjectParams = TypeParams<schemas.$ZodObject, "shape" | "catchall">;

// ZodUnion
export type $ZodUnionParams = TypeParams<schemas.$ZodUnion, "options">;
export function _union<const T extends readonly schemas.$ZodObject[]>(
  Class: util.SchemaClass<schemas.$ZodUnion>,
  options: T,
  params?: string | $ZodUnionParams
): schemas.$ZodUnion<T> {
  return new Class({
    type: "union",
    options,
    ...util.normalizeParams(params),
  }) as any;
}

// ZodDiscriminatedUnion
export interface $ZodTypeDiscriminableInternals extends schemas.$ZodTypeInternals {
  propValues: util.PropValues;
}

export interface $ZodTypeDiscriminable extends schemas.$ZodType {
  _zod: $ZodTypeDiscriminableInternals;
}
export type $ZodDiscriminatedUnionParams = TypeParams<schemas.$ZodDiscriminatedUnion, "options" | "discriminator">;
export function _discriminatedUnion<
  Types extends [$ZodTypeDiscriminable, ...$ZodTypeDiscriminable[]],
  Disc extends string,
>(
  Class: util.SchemaClass<schemas.$ZodDiscriminatedUnion>,
  discriminator: Disc,
  options: Types,
  params?: string | $ZodDiscriminatedUnionParams
): schemas.$ZodDiscriminatedUnion<Types, Disc> {
  return new Class({
    type: "union",
    options,
    discriminator,
    ...util.normalizeParams(params),
  }) as any;
}

// ZodIntersection
export type $ZodIntersectionParams = TypeParams<schemas.$ZodIntersection, "left" | "right">;
export function _intersection<T extends schemas.$ZodObject, U extends schemas.$ZodObject>(
  Class: util.SchemaClass<schemas.$ZodIntersection>,
  left: T,
  right: U
): schemas.$ZodIntersection<T, U> {
  return new Class({
    type: "intersection",
    left,
    right,
  }) as any;
}

// ZodTuple
export type $ZodTupleParams = TypeParams<schemas.$ZodTuple, "items" | "rest">;
export function _tuple<T extends readonly [schemas.$ZodType, ...schemas.$ZodType[]]>(
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="1988-2058">
      );
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0) return result;
        results.push(result);
      }
    }

    if (!async) return handleUnionResults(results as ParsePayload[], payload, inst, ctx);
    return Promise.all(results).then((results) => {
      return handleUnionResults(results as ParsePayload[], payload, inst, ctx);
    });
  };
});

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////                                  //////////
//////////      $ZodDiscriminatedUnion      //////////
//////////                                  //////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface $ZodDiscriminatedUnionDef<
  Options extends readonly SomeType[] = readonly $ZodType[],
  Disc extends string = string,
> extends $ZodUnionDef<Options> {
  discriminator: Disc;
  unionFallback?: boolean;
}

export interface $ZodDiscriminatedUnionInternals<
  Options extends readonly SomeType[] = readonly $ZodType[],
  Disc extends string = string,
> extends $ZodUnionInternals<Options> {
  def: $ZodDiscriminatedUnionDef<Options, Disc>;
  propValues: util.PropValues;
}

export interface $ZodDiscriminatedUnion<
  Options extends readonly SomeType[] = readonly $ZodType[],
  Disc extends string = string,
> extends $ZodType {
  _zod: $ZodDiscriminatedUnionInternals<Options, Disc>;
}

export const $ZodDiscriminatedUnion: core.$constructor<$ZodDiscriminatedUnion> =
  /*@__PURE__*/
  core.$constructor("$ZodDiscriminatedUnion", (inst, def) => {
    $ZodUnion.init(inst, def);

    const _super = inst._zod.parse;
    util.defineLazy(inst._zod, "propValues", () => {
      const propValues: util.PropValues = {};
      for (const option of def.options) {
        const pv = option._zod.propValues;
        if (!pv || Object.keys(pv).length === 0)
          throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
        for (const [k, v] of Object.entries(pv!)) {
          if (!propValues[k]) propValues[k] = new Set();
          for (const val of v) {
            propValues[k].add(val);
          }
        }
      }
      return propValues;
    });

    const disc = util.cached(() => {
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/mini/schemas.ts" lines="885-962">
// ZodMiniUnion
export interface ZodMiniUnion<T extends readonly SomeType[] = readonly core.$ZodType[]>
  extends _ZodMiniType<core.$ZodUnionInternals<T>> {
  // _zod: core.$ZodUnionInternals<T>;
}
export const ZodMiniUnion: core.$constructor<ZodMiniUnion> = /*@__PURE__*/ core.$constructor(
  "ZodMiniUnion",
  (inst, def) => {
    core.$ZodUnion.init(inst, def);
    ZodMiniType.init(inst, def);
  }
);

export function union<const T extends readonly SomeType[]>(
  options: T,
  params?: string | core.$ZodUnionParams
): ZodMiniUnion<T> {
  return new ZodMiniUnion({
    type: "union",
    options: options as any as core.$ZodType[],
    ...util.normalizeParams(params),
  }) as any;
}

// ZodMiniDiscriminatedUnion
export interface ZodMiniDiscriminatedUnion<
  Options extends readonly SomeType[] = readonly core.$ZodType[],
  Disc extends string = string,
> extends ZodMiniUnion<Options> {
  _zod: core.$ZodDiscriminatedUnionInternals<Options, Disc>;
}
export const ZodMiniDiscriminatedUnion: core.$constructor<ZodMiniDiscriminatedUnion> = /*@__PURE__*/ core.$constructor(
  "ZodMiniDiscriminatedUnion",
  (inst, def) => {
    core.$ZodDiscriminatedUnion.init(inst, def);
    ZodMiniType.init(inst, def);
  }
);

export function discriminatedUnion<
  Types extends readonly [core.$ZodTypeDiscriminable, ...core.$ZodTypeDiscriminable[]],
  Disc extends string,
>(
  discriminator: Disc,
  options: Types,
  params?: string | core.$ZodDiscriminatedUnionParams
): ZodMiniDiscriminatedUnion<Types, Disc> {
  return new ZodMiniDiscriminatedUnion({
    type: "union",
    options,
    discriminator,
    ...util.normalizeParams(params),
  }) as ZodMiniDiscriminatedUnion<Types, Disc>;
}

// ZodMiniIntersection
export interface ZodMiniIntersection<A extends SomeType = core.$ZodType, B extends SomeType = core.$ZodType>
  extends _ZodMiniType<core.$ZodIntersectionInternals<A, B>> {
  // _zod: core.$ZodIntersectionInternals<A, B>;
}
export const ZodMiniIntersection: core.$constructor<ZodMiniIntersection> = /*@__PURE__*/ core.$constructor(
  "ZodMiniIntersection",
  (inst, def) => {
    core.$ZodIntersection.init(inst, def);
    ZodMiniType.init(inst, def);
  }
);

export function intersection<T extends SomeType, U extends SomeType>(left: T, right: U): ZodMiniIntersection<T, U> {
  return new ZodMiniIntersection({
    type: "intersection",
    left: left as any as core.$ZodType,
    right: right as any as core.$ZodType,
  }) as any;
}

// ZodMiniTuple
export interface ZodMiniTuple<
</production_snippet>
