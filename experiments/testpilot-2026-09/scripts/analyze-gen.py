"""Analyze recorded generation artifacts only; standard library, no model calls."""
import argparse,collections,csv,json,re,statistics
from pathlib import Path
R=Path(__file__).resolve().parents[1]/'results'
ap=argparse.ArgumentParser(); ap.add_argument('--condition',default='gen-n60',help='run directory under results/, or several joined by commas'); ap.add_argument('--api',default='api-sample-n60-s20260919.json',help='API file name under results/'); ap.add_argument('--no-examples',action='store_true',help='do not write gen-examples'); ap.add_argument('--prefix',default=None,help='output file prefix (default: the condition)')
ARGS=ap.parse_args(); RUNS=ARGS.condition.split(','); MULTI=len(RUNS)>1; D=R/RUNS[0]; C=ARGS.prefix or ARGS.condition
def rundir(x): return R/str(x).split(':')[0] if MULTI else D
def load(p): return json.loads(p.read_text())
def category(t):
 e=t.get('err',{}); s=e.get('stack','')+' '+e.get('message','')
 if 'AssertionError' in s: return 'assertion'
 if e.get('code') in ('ENOENT','EACCES','EISDIR','EEXIST','ENOTEMPTY'): return 'file-system'
 if any(v in s for v in ('TypeError','ReferenceError','SyntaxError','Invalid syntax','done() invoked with non-Error','Maximum call stack size exceeded')): return 'correctness'
 if 'Timeout of' in s or e.get('code')=='ERR_MOCHA_TIMEOUT': return 'timeout'
 return 'other'
def table(lines,head,rows):
 lines+=['| '+' | '.join(head)+' |','| '+' | '.join('---' for _ in head)+' |']
 for row in rows: lines.append('| '+' | '.join(str(v).replace('|','\\|').replace('\n',' ') for v in row)+' |')
 lines.append('')
def main():
 reports=[(run,load(R/run/'report.json')) for run in RUNS]; sample=load(R/ARGS.api)
 if MULTI:
  # prompt ids and test names repeat across runs: prompt ids become '<run>:<id>' and each test carries its run
  assert all(rep['metaData']==reports[0][1]['metaData'] for _,rep in reports)
  prompts=[dict(p,id=f"{run}:{p['id']}") for run in RUNS for p in load(R/run/'prompts.json')['prompts']]
  tests=[dict(t,run=run,promptIds=[f'{run}:{i}' for i in t['promptIds']]) for run,rep in reports for t in rep['tests']]
  report=dict(metaData=reports[0][1]['metaData'],stats={run:rep['stats'] for run,rep in reports})
 else: report=reports[0][1]; prompts=load(D/'prompts.json')['prompts']; tests=report['tests']
 strata=dict(line.split('\t') for line in (R/'population-main.txt').read_text().splitlines()); byid={p['id']:p for p in prompts}
 def refs(p): return '+'.join(sorted({v['refiner'] for v in p['provenance']})) or 'Base'
 def testrefs(t): return sorted({refs(byid[i]) for i in t['promptIds']})
 status=collections.Counter(t['status'] for t in tests)
 assert len(tests)==sum(rep['stats']['nrTests'] for _,rep in reports)
 for state,key in [('PASSED','nrPasses'),('FAILED','nrFailures'),('PENDING','nrPending'),('OTHER','nrOther')]: assert status[state]==sum(rep['stats'][key] for _,rep in reports)
 assert all(i in byid for t in tests for i in t['promptIds'])
 grouped={f['accessPath']:[t for t in tests if t['api']==f['accessPath']] for f in sample}
 assert all(t['api'] in grouped for t in tests)
 empties=[p['id'] for p in prompts if not p.get('completions') or not any(p['completions'])]
 multiple=[p['id'] for p in prompts if any(len(re.findall(r'\bit\s*\(',c or ''))>1 for c in p.get('completions',[]))]
 totals=dict(functions=len(sample),functionsWithTests=sum(bool(v) for v in grouped.values()),functionsWithPasses=sum(any(t['status']=='PASSED' for t in v) for v in grouped.values()),prompts=len(prompts),emptyCompletionPrompts=len(empties),multipleItPrompts=len(multiple),tests=len(tests),statuses=dict(status))
 lines=['# Generation analysis','', 'All figures derive from recorded artifacts; no tests are regenerated. Passing rates use tests as the denominator. Refiner combinations are the distinct immediate provenance labels recorded for a prompt; deduplicated tests may trace to multiple prompts and combinations, so refiner counts overlap.','']
 if MULTI: lines+=['Runs combined: '+', '.join(f'`{r}`' for r in RUNS)+". Prompt IDs are written `<run>:<id>`; test names repeat across runs, so each test is identified by its run and test name.",'']
 table(lines,['Metric','Value'],[(k,json.dumps(v) if isinstance(v,dict) else v) for k,v in totals.items()])
 perstratum=[]
 for s in ('S','C','Q'):
  ts=[t for t in tests if strata[t['api']]==s]; passing=sum(t['status']=='PASSED' for t in ts); n=sum(strata[f['accessPath']]==s for f in sample)
  perstratum.append([s,n,len(ts),passing,f'{passing/len(ts):.2%}' if ts else 'N/A'])
 table(lines,['Stratum','Functions','Tests','Passing','Pass rate'],perstratum)
 lines+=['## Per function','']; table(lines,['API','Tests','Passing','Failing','First failing message'],[[api,len(ts),sum(t['status']=='PASSED' for t in ts),sum(t['status']=='FAILED' for t in ts),next((t.get('err',{}).get('message','')[:120] for t in ts if t['status']=='FAILED'),'')] for api,ts in sorted(grouped.items())])
 failures=[t for t in tests if t['status']=='FAILED']; cats=collections.Counter(category(t) for t in failures)
 lines+=['## Failure categories','']; table(lines,['Category','Count'],[(c,cats[c]) for c in ('assertion','file-system','correctness','timeout','other')])
 lines+=['First three other messages:','']+[f"- {t.get('err',{}).get('message','')}" for t in [t for t in failures if category(t)=='other'][:3]]+['']
 refcounts=collections.Counter(refs(p) for p in prompts); refpasses={r:sum(t['status']=='PASSED' and r in testrefs(t) for t in tests) for r in refcounts}
 lines+=['## Refiner effects','']; table(lines,['Recorded refiner combination','Prompts','Passing tests tracing here'],[[r,n,refpasses[r]] for r,n in sorted(refcounts.items())])
 prompt_api={}
 for t in tests:
  for pid in t['promptIds']: prompt_api.setdefault(pid,set()).add(t['api'])
 lengths=[]
 for p in prompts:
  text=(rundir(p['id'])/'prompts'/p['file']).read_text(); apis=prompt_api.get(p['id'],set())
  if not apis: apis={f['accessPath'] for f in sample if f['accessPath']+'(' in text}
  lengths.append((len(text),p['id'],', '.join(sorted(apis))))
 lines+=['## Prompt lengths','']; table(lines,['Min chars','Median','Max'],[[min(x[0] for x in lengths),statistics.median(x[0] for x in lengths),max(x[0] for x in lengths)]]); table(lines,['Length','Prompt ID','API'],sorted(lengths,reverse=True)[:3])
 lines += [f'Prompts whose completion contains more than one `it(` (whitespace allowed): {len(multiple)}. IDs: {multiple}',f'Empty completion prompt IDs: {empties}','']
 passing=[{k:t[k] for k in (('run',) if MULTI else ())+('testName','api','testFile')} for t in tests if t['status']=='PASSED']; (R/f'{C}-passing.json').write_text(json.dumps(passing,indent=2)+'\n')
 with (R/f'{C}-tests.csv').open('w',newline='') as f:
  w=csv.writer(f); w.writerow((['run'] if MULTI else [])+['testName','api','stratum','status','promptIds','refiners','errMessage'])
  for t in tests: w.writerow(([t['run']] if MULTI else [])+[t['testName'],t['api'],strata[t['api']],t['status'],json.dumps(t['promptIds']),'; '.join(testrefs(t)),(t.get('err',{}).get('message','').strip().splitlines() or [''])[0]])
 examples=R/'gen-examples'
 if not ARGS.no_examples: examples.mkdir(exist_ok=True)
 choices=[next((t for t in tests if t['status']=='PASSED' and strata[t['api']]==s),None) for s in ('S','C')]+[next((t for t in failures if category(t)=='assertion'),None)]
 for label,t in zip(('passing S','passing C','failing assertion'),choices if not ARGS.no_examples else []):
  if t is None: lines.append('Example unavailable: '+label); continue
  p=byid[t['promptIds'][0]]; text=(rundir(p['id'])/'prompts'/p['file']).read_text(); completion='\n'.join(p.get('completions',[])); test=(rundir(p['id'])/'tests'/t['testFile']).read_text()
  dest=examples/(t['api']+'.md')
  if dest.exists() and label=='failing assertion': dest=examples/(t['api']+'-assertion.md')
  dest.write_text(f"# {label}: {t['api']}\n\nPrompt ID {p['id']}; test {t['testName']}.\n\n## Prompt (verbatim)\n\n````text\n{text}\n````\n\n## Completion (verbatim)\n\n````text\n{completion}\n````\n\n## Assembled test (verbatim)\n\n````javascript\n{test}\n````\n\n## Outcome\n\n```json\n{json.dumps(t,indent=2)}\n```\n")
 (R/f'{C}-analysis.md').write_text('\n'.join(lines))
 summary=dict(totals=totals,perStratum=perstratum,failureCategories=dict(cats),refinerPrompts=dict(refcounts),refinerPassingTests=refpasses,metaData=report['metaData'],stats=report['stats'],failedRequests=sum((R/run/'stdout.txt').read_text().count('Failed to get completions') for run in RUNS))
 if MULTI: summary['nullCompletions']={run:(R/run/'stdout.txt').read_text().count('Null completion (') for run in RUNS}
 (R/f'{C}-analysis.json').write_text(json.dumps(summary,indent=2)+'\n'); print(json.dumps(summary,indent=2))
if __name__=='__main__': main()
