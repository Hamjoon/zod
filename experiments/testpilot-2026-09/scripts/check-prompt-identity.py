"""Compare non-retry prompt texts and snippetMap entries of two generation results on their shared functions.
Recorded artifacts only; standard library, no model calls."""
import argparse,collections,difflib,json
from genruns import R,refs,load
ap=argparse.ArgumentParser(); ap.add_argument('--a',default='gen-n60',help='run directory, or several joined by commas'); ap.add_argument('--b',default='gen-n124-run2,gen-n124-tail'); ap.add_argument('--shared',default='api-sample-n60-s20260919.json',help='API file under results/ defining the shared functions'); ap.add_argument('--out',default=None)
ARGS=ap.parse_args()
def side(runs,shared):
 prompts,owner,_=load(runs); texts=collections.defaultdict(list)
 for key,p in prompts.items():
  if 'RetryWithError' in refs(p) or owner[key] not in shared: continue
  texts[owner[key]].append((key,refs(p),p['text']))
 snip={}
 for run in runs:
  for k,v in json.loads((R/run/'snippetMap.json').read_text()):
   assert snip.get(k,v)==v,(run,k); snip[k]=v
 return texts,snip
def main():
 A=ARGS.a.split(','); B=ARGS.b.split(','); shared=[f['accessPath'] for f in json.loads((R/ARGS.shared).read_text())]; S=set(shared)
 ta,sa=side(A,S); tb,sb=side(B,S); a,b=' + '.join(A),' + '.join(B)
 lines=[f'# Prompt identity: {b} vs {a}','',f'Scope: the {len(shared)} functions of `{ARGS.shared}`. Non-retry prompts are those whose recorded provenance contains no `RetryWithError` step. Comparison is of exact prompt file text, as multisets per function. Prompt IDs are written `<run>:<id>`.','',
  'Mapping method: testpilot2 generates functions one at a time in `api.json` order, and each function\'s prompts begin with its Base prompt (empty provenance). Each prompt is assigned to the function whose block contains it (walk prompts in id order, advance to the next function at each Base prompt). The script asserts that this agrees with the tool\'s `tests[].api` for the first prompt ID of every test; it does in every run used here. `tests[].api` alone is not used because the tool merges identical tests across functions (in gen-n124-run2 the seven empty completions of seven functions form one test, `test_110.js`, recorded under `zod.z.url`), and prompt-text matching is ambiguous.','']
 na=sum(len(ta[f]) for f in shared); nb=sum(len(tb[f]) for f in shared); same=0; mism=[]; perfn=[]
 for f in shared:
  ca=collections.Counter(x[2] for x in ta[f]); cb=collections.Counter(x[2] for x in tb[f]); inter=sum((ca&cb).values()); same+=inter; ok=ca==cb
  perfn.append((f,len(ta[f]),len(tb[f]),inter,ok))
  if not ok: mism.append((f,[x for x in ta[f] if (ca-cb)[x[2]]],[x for x in tb[f] if (cb-ca)[x[2]]]))
 lines+=['## Non-retry prompts','','| Measure | Value |','| --- | ---: |',f'| Non-retry prompts, {a} | {na} |',f'| Non-retry prompts, {b} | {nb} |',f'| Identical (multiset intersection) | {same} |',f'| Functions with identical multisets | {sum(x[4] for x in perfn)} of {len(shared)} |','',f'Result: **{"IDENTICAL" if not mism else "MISMATCH"}**.','']
 if mism:
  lines+=['### First three mismatches','']
  for f,oa,ob in mism[:3]:
   lines+=[f'#### {f}','',f'Only in {a}: {[(i,r) for i,r,_ in oa]}; only in {b}: {[(i,r) for i,r,_ in ob]}','']
   for i,r,t in oa[:1]:
    other=next((x for x in ob if x[1]==r),ob[0] if ob else (None,None,''))
    d=''.join(difflib.unified_diff(t.splitlines(True),other[2].splitlines(True),i,str(other[0])))
    lines+=['```diff',d.rstrip(),'```','']
 lines+=['## Per function','',f'| API | Non-retry prompts {a} | Non-retry prompts {b} | Identical | Same multiset |','| --- | ---: | ---: | ---: | --- |']+[f'| {f} | {x} | {y} | {i} | {"yes" if ok else "**no**"} |' for f,x,y,i,ok in sorted(perfn)]+['']
 keys=sorted({f.split('.')[-1] for f in shared}); sm=[k for k in keys if sa.get(k)!=sb.get(k)]
 lines+=['## snippetMap.json','',f'`snippetMap.json` is keyed by the function name without namespace (so `zod.z.number` and `zod.z.coerce.number` share the key `number`); for a multi-run side the maps are merged (the script asserts that runs agree on shared keys). Keys of the shared functions: {len(keys)}; present in {a}: {sum(k in sa for k in keys)}; present in {b}: {sum(k in sb for k in keys)}; identical entries: {len(keys)-len(sm)}; differing: {sm}.','']
 out=R/(ARGS.out or 'gen-n124-prompt-identity.md'); out.write_text('\n'.join(lines))
 print(json.dumps(dict(nonRetryA=na,nonRetryB=nb,identical=same,functionsMismatched=[m[0] for m in mism],snippetKeys=len(keys),snippetDiffering=sm,out=str(out))))
if __name__=='__main__': main()
