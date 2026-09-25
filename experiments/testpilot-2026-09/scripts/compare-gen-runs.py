"""Descriptive comparison of two generation results on their shared functions (default: the n124 result, gen-n124-run2 + gen-n124-tail,
vs gen-n60 on the 60 sampled functions). Recorded artifacts only; standard library, no model calls, no statistical tests."""
import argparse,collections,json
from genruns import R,refs,load,testfile
ap=argparse.ArgumentParser(); ap.add_argument('--a',default='gen-n60',help='run directory, or several joined by commas'); ap.add_argument('--b',default='gen-n124-run2,gen-n124-tail'); ap.add_argument('--shared',default='api-sample-n60-s20260919.json',help='API file under results/ defining the shared functions'); ap.add_argument('--out',default=None)
ARGS=ap.parse_args()
KINDS=['Base','FunctionBodyIncluder','SnippetIncluder','FunctionBodyIncluder+SnippetIncluder','RetryWithError']
NAMES={'Base':'base','FunctionBodyIncluder':'body','SnippetIncluder':'snippets','FunctionBodyIncluder+SnippetIncluder':'body + snippets','RetryWithError':'retry'}
def side(runs,shared):
 prompts,owner,alltests=load(runs)
 tests=[t for t in alltests if t['api'] in shared]
 # as in analyze-gen.py: a test counts once per distinct recorded refiner combination it traces to
 refpass=collections.Counter(r for t in tests if t['status']=='PASSED' for r in {refs(prompts[i]) for i in t['promptIds']})
 refprompts=collections.Counter(refs(p) for k,p in prompts.items() if owner[k] in shared)
 files=collections.defaultdict(list)
 for t in tests: files[t['api']].append(testfile(t).read_bytes())
 per={f:(sum(t['api']==f for t in tests),sum(t['api']==f and t['status']=='PASSED' for t in tests)) for f in shared}
 return dict(prompts=sum(owner[k] in shared for k in prompts),tests=len(tests),passing=sum(t['status']=='PASSED' for t in tests),per=per,refpass=refpass,refprompts=refprompts,files=files)
def pct(a,b): return f'{a/b:.2%}' if b else 'N/A'
def main():
 shared=[f['accessPath'] for f in json.loads((R/ARGS.shared).read_text())]; S=set(shared); A=side(ARGS.a.split(','),S); B=side(ARGS.b.split(','),S)
 a,b=' + '.join(ARGS.a.split(',')),' + '.join(ARGS.b.split(','))
 lines=[f'# {b} vs {a} on the {len(shared)} shared functions','',f'Descriptive only; no statistical tests. Scope: the functions of `{ARGS.shared}`. Prompts are assigned to functions by their generation block (see `scripts/genruns.py`); tests by the tool\'s recorded `api`. Passing means status `PASSED` in `report.json`.','','## Totals','',f'| Measure | {a} | {b} |','| --- | ---: | ---: |']
 for k,label in (('prompts','Prompts'),('tests','Tests'),('passing','Passing tests')): lines.append(f'| {label} | {A[k]} | {B[k]} |')
 lines+=[f'| Pass rate (tests) | {pct(A["passing"],A["tests"])} | {pct(B["passing"],B["tests"])} |',f'| Functions with at least one passing test | {sum(v[1]>0 for v in A["per"].values())} | {sum(v[1]>0 for v in B["per"].values())} |','']
 lines+=['## Passing tests per prompt provenance','','Counted as in last week\'s analysis: the distinct refiner labels recorded in a prompt\'s provenance form its combination; a test is counted once per combination it traces to.','',f'| Provenance | Prompts {a} | Passing {a} | Prompts {b} | Passing {b} |','| --- | ---: | ---: | ---: | ---: |']
 for k in KINDS+sorted((set(A['refprompts'])|set(B['refprompts']))-set(KINDS)): lines.append(f'| {NAMES.get(k,k)} (`{k}`) | {A["refprompts"][k]} | {A["refpass"][k]} | {B["refprompts"][k]} | {B["refpass"][k]} |')
 lines.append('')
 ident={}
 for f in shared:
  ca=collections.Counter(A['files'][f]); cb=collections.Counter(B['files'][f]); ident[f]=sum((ca&cb).values())
 diffn=[f for f in shared if A['per'][f][1]!=B['per'][f][1]]
 lines+=['## Byte-identical test files','',f'Generated test files (`tests/*.js`, as stored by the tool after `completeTest`) of one function that are byte-identical between the two results, counted as a multiset intersection per function: **{sum(ident.values())}** (of {A["tests"]} in {a} and {B["tests"]} in {b}); functions with at least one identical file: {sum(v>0 for v in ident.values())}.','']
 lines+=['## Per function','',f'Functions whose passing count differs: **{len(diffn)}** of {len(shared)} (marked **≠**).','',f'| API | Tests {a} | Passing {a} | Tests {b} | Passing {b} | Identical files | Passing differs |','| --- | ---: | ---: | ---: | ---: | ---: | --- |']
 for f in sorted(shared): lines.append(f'| {f} | {A["per"][f][0]} | {A["per"][f][1]} | {B["per"][f][0]} | {B["per"][f][1]} | {ident[f]} | {"**≠**" if f in diffn else ""} |')
 lines.append('')
 out=R/(ARGS.out or 'gen-n124-vs-n60.md'); out.write_text('\n'.join(lines))
 print(json.dumps(dict(a={k:A[k] for k in ('prompts','tests','passing')},b={k:B[k] for k in ('prompts','tests','passing')},passingDiffers=len(diffn),identicalFiles=sum(ident.values()),out=str(out))))
if __name__=='__main__': main()
