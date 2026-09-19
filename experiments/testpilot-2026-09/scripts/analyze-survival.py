"""Compute Stage S tables and matrices from recorded artifacts (stdlib only)."""
import collections,csv,importlib.util,json,re
from pathlib import Path
E=Path(__file__).resolve().parents[1];R=E/'results';D=R/'survival'
def load(p):return json.loads(p.read_text())
def optional(p,default):return load(p) if p.exists() else default
def table(lines,header,rows):
 lines.extend(['| '+' | '.join(header)+' |','| '+' | '.join('---' for _ in header)+' |'])
 for row in rows:lines.append('| '+' | '.join(str(x).replace('|','\\|').replace('\n',' ') for x in row)+' |')
 lines.append('')
def writecsv(name,headers,rows):
 with (R/name).open('w',newline='') as f:w=csv.writer(f);w.writerow(headers);w.writerows(rows)
def key(c):return c['file'],c['fullName']
def firstbreak(states,passing):return next((t for t,s in states if s not in (passing,'unavailable')),'')
def rebound(states,passing):
 broken=False
 for t,s in states:
  if s=='unavailable':continue
  if s!=passing:broken=True
  elif broken:return True
 return False
def main():
 refs=load(D/'tags.json');tags=[r['tag'] for r in refs];later=tags[1:];S=load(R/'gen-n60-passing.json');sample=load(R/'api-sample-n60-s20260919.json');strata=dict(l.split('\t') for l in (R/'population-main.txt').read_text().splitlines())
 assert len(S)==139
 llm={t:{r['testName']:r for r in optional(D/t/'llm-results.json',[])} for t in tags};dev={t:{key(c):c for c in optional(D/t/'dev-cases.json',[])} for t in tags};baseline=list(dev[tags[0]])
 assert len(baseline)==888
 def ls(t,n):return llm[t].get(n,{}).get('status','unavailable')
 def ds(t,k):return dev[t].get(k,{}).get('status','unavailable')
 funcs=[f['accessPath'] for f in sample if any(s['api']==f['accessPath'] for s in S)];assert len(funcs)==54
 def survivors(t,api):return sum(ls(t,s['testName'])=='pass' for s in S if s['api']==api)
 lines=['# Stage S survival analysis','','All tests are frozen at v4.0.5. LLM denominator is 139; developer denominator is 888 runtime cases. Harness failures are unavailable, never test failures. Developer file-load failures inherit the baseline cases as failed. Test-file A/M/D counts describe ignored upstream edits only.','']
 release_rows=[];wall=[]
 for r in refs:
  t=r['tag'];b=optional(D/t/'build-status.json',{});d=optional(D/t/'dev-summary.json',{});counts=collections.Counter(v['status'] for v in llm[t].values());changes=collections.Counter(l.split()[0] for l in (D/t/'devtest-diff.txt').read_text().splitlines());l_ok=bool(llm[t]);d_ok=bool(d)
  release_rows.append([t,r['commit'],r['date'],'ok' if b.get('build') else 'failed',b.get('probe','not-run'),'/'.join(str(counts[s]) for s in ['pass','fail','load-error','timeout','other']) if l_ok else 'unavailable',f"{counts['pass']}/139 ({counts['pass']/139:.2%})" if l_ok else 'unavailable',f"{d['files_loaded']}/{d['passed']}/{d['failed']}" if d_ok else 'unavailable',f"{d['passed']}/888 ({d['passed']/888:.2%})" if d_ok else 'unavailable','/'.join(str(changes[x]) for x in ['A','M','D'])])
  secs=[b.get('wallSeconds',0),optional(D/t/'llm-summary.json',{}).get('wallSeconds',0),optional(D/t/'dev-status.json',{}).get('wallSeconds',0)];wall.append([t,*[round(x,3) for x in secs],round(sum(secs),3)])
 header=['Tag','Commit','Date','Build','Probe','LLM P/F/load/timeout/other','LLM survival','Dev loaded/passed/failed','Dev survival','Dev A/M/D'];table(lines,header,release_rows)
 lines+=['## Per stratum',''];table(lines,['Stratum','Tests in S',*tags],[[s,len(ts:= [v for v in S if strata[v['api']]==s]),*[f"{sum(ls(t,v['testName'])=='pass' for v in ts)}/{len(ts)} ({sum(ls(t,v['testName'])=='pass' for v in ts)/len(ts):.2%})" if llm[t] else 'unavailable' for t in tags]] for s in ['S','C','Q']])
 lines+=['## Per function',''];table(lines,['Function','Tests in S',*later],[[api,sum(s['api']==api for s in S),*[survivors(t,api) if llm[t] else 'unavailable' for t in later]] for api in funcs])
 spec=importlib.util.spec_from_file_location('analyze_gen',E/'scripts/analyze-gen.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
 candidates=[]
 for t in tags:
  lines += [f'## LLM failures: {t}',''];bad=[v for v in llm[t].values() if v['status']!='pass'];cats=collections.Counter()
  for v in bad:
   raw=D/t/'llm-raw'/(v['testName']+'.stdout.json');err={}
   try:err=load(raw).get('failures',[{}])[0].get('err',{})
   except (ValueError,IndexError):pass
   if not err:err={'message':v['err'],'stack':v.get('stackFirstLine',''),'code':v.get('errorCode')}
   cats[module.category({'err':err})]+=1
   if module.category({'err':err})=='assertion':candidates.append([t,v['testName'],v['api'],v['err']])
  table(lines,['Category','Count'],[[c,cats[c]] for c in ['assertion','file-system','correctness','timeout','other']]);freq=collections.Counter((v['err'].strip().splitlines() or [''])[0] for v in bad);table(lines,['Error first line','Count'],freq.most_common(10))
 llm_matrix=[];dev_matrix=[];llm_break=[];dev_break=[]
 for s in S:
  n=s['testName'];states=[(t,ls(t,n)) for t in tags];first=firstbreak(states,'pass');err=llm[first][n]['err'] if first else '';back=rebound(states,'pass');llm_matrix.append([n,s['api'],strata[s['api']],*[v for t,v in states],first,err]);llm_break.append([n,s['api'],first or 'never',back])
 for k in baseline:
  states=[(t,ds(t,k)) for t in tags];first=firstbreak(states,'passed');back=rebound(states,'passed');dev_matrix.append([*k,*[v for t,v in states],first]);dev_break.append([*k,first or 'never',back])
 writecsv('survival-llm-matrix.csv',['testName','api','stratum',*['status@'+t for t in tags],'first_break','err_at_first_break'],llm_matrix)
 writecsv('survival-dev-matrix.csv',['file','fullName',*['status@'+t for t in tags],'first_break'],dev_matrix)
 lines+=['## First breaks and returns to passing','','First breaks include the control; non-passing baseline observations are retained. A return to passing is any later pass following a non-pass.',''];table(lines,['Corpus','Never break','Break then pass again'],[['LLM',sum(r[2]=='never' for r in llm_break),sum(r[3] for r in llm_break)],['Dev',sum(r[2]=='never' for r in dev_break),sum(r[3] for r in dev_break)]])
 table(lines,['LLM test','API','First break','Pass again'],llm_break);table(lines,['Dev file','Case','First break','Pass again'],dev_break)
 for t in tags:
  lines += [f'## Developer failures by file: {t}',''];group=collections.defaultdict(list)
  for c in dev[t].values():
   if c['status']=='failed':group[c['file']].append(c)
  table(lines,['File','Failed cases','First message'],[[f,len(cs),cs[0]['message_first_line']] for f,cs in sorted(group.items())])
 files=sorted({k[0] for k in baseline});mapping={};unmatched=[];pair_rows=[]
 for api in funcs:
  name=api.split('.')[-1];kebab=re.sub(r'(?<!^)(?=[A-Z])','-',name).lower();names=list(dict.fromkeys([name,name.lower(),kebab,kebab+'s']))
  matches=[f for f in files if Path(f).parent.as_posix() in ['classic/tests','core/tests','mini/tests'] and Path(f).name in [n+'.test.ts' for n in names]];mapping[api]=matches
  if not matches:unmatched.append(api)
  count=sum(s['api']==api for s in S);keys=[k for k in baseline if k[0] in matches];row=[api,'; '.join(matches),count,len(keys)]
  for t in later:row += [survivors(t,api) if llm[t] else 'unavailable',sum(ds(t,k)=='passed' for k in keys) if matches and dev[t] else 'unmatched' if not matches else 'unavailable']
  pair_rows.append(row)
 (R/'pair-map.json').write_text(json.dumps(mapping,indent=2)+'\n');pair_header=['Function','Dev files','LLM baseline','Dev baseline',*[v for t in later for v in [t+' LLM survivors',t+' dev passed']]]
 writecsv('survival-pairs.csv',pair_header,pair_rows);lines+=['## Automatic file-name pairing','','Matches are filename-based; counts sum all exact/lowercase/kebab/plural matches across classic, core, and mini. This does not establish semantic equivalence between corpora.',''];table(lines,pair_header,pair_rows)
 lines+=['Functions with no automatic match:','',*[f'- `{api}`' for api in unmatched],'','## Flaky at t',''];flaky=[v for v in llm[tags[0]].values() if v['status']!='pass'];table(lines,['Test','Status','Error'],[[v['testName'],v['status'],v['err']] for v in flaky]);lines+=['No exclusions; all 139 remain in the denominator.','','## Measured wall times',''];table(lines,['Release','Install/build/env seconds','LLM seconds','Dev seconds','Total seconds'],wall);lines += [f"Sum of measured per-release stages: {sum(r[-1] for r in wall):.3f} seconds.",'']
 (R/'survival-summary.md').write_text('\n'.join(lines))
 hand=['# Stage S handover','','Stage S replay completed with any unavailable releases identified below. No model calls; frozen generated tests and testpilot2 unchanged. No report or archive branch created.',''];table(hand,header,release_rows)
 hand+=['## Commands and deviations','','Validator: `/work/testpilot2/node_modules/.bin/nyc --cwd=$W --exclude=test-XXXXXX --reporter=json --report-dir=$coverageDir --temp-dir=$coverageDir /work/testpilot2/node_modules/.bin/mocha --full-trace --exit --allow-uncaught=false --reporter=json --reporter-option output=$reportFile -- $testFile`.','','Runner: `/work/testpilot2/node_modules/.bin/mocha --full-trace --exit --allow-uncaught=false --reporter=json --reporter-option output=/dev/stdout -- $W/test-s/$basename`.','','D-10 not needed: all tags found. D-11 removes nyc, as prescribed; identical Mocha flags, JSON destination changed to stdout; 5000 ms SIGKILL timeout. D-12 preserves a byte-identical frozen test-directory snapshot before the control replacement to avoid the instruction’s destructive self-copy. D-13 records an incorrectly selected no-frozen-lockfile retry at v4.6.0 (command text matched by the helper); no install or test occurred. D-14 records the corrected COREPACK_ENABLE_STRICT=0 fallback, which also fails with Unsupported package manager specification (nub@0.8.3). v4.6.0 build/probe are unavailable; no manager substitution or source edits made. Pre-existing untracked Claude outputs/ is retained as documented in Stage G.','','Vitest: `npx vitest run src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=$R/dev-run.json`, cwd each release packages/zod.','']
 table(hand,['Release','Install/build fallbacks','Vitest typecheck flag','Dev harness'],[[t,optional(D/t/'build-status.json',{}).get('fallbacks',[]),optional(D/t/'dev-status.json',{}).get('typecheckFlagAccepted'),optional(D/t/'dev-status.json',{}).get('harness')] for t in tags])
 control=optional(D/tags[0]/'dev-summary.json',{});hand += [f"Control: LLM {sum(v['status']=='pass' for v in llm[tags[0]].values())}/139; dev {control.get('files')} files, {control.get('passed')}/{control.get('cases')} passed.",''];table(hand,['Release','Install/build/env seconds','LLM seconds','Dev seconds','Total seconds'],wall);hand += [f"Measured per-release stage total: {sum(r[-1] for r in wall):.3f} seconds. See command log for setup and cleanup.",'','## Unmatched functions','',*[f'- `{api}`' for api in unmatched],'','## Manual second-pass questions','','Which failing assertions depend on error-message strings or internal structures instead of a public contract? The following are unclassified assertion-error candidates, selected only by the existing error predicate; inspect their unchanged sources manually.',''];table(hand,['Release','Test','API','Error text'],candidates);hand+=['## Cleanup and verification','','Wrapper restored to ../../../../../packages/zod and verified at 4.0.5; scratch test-s absent. Export trees and their node_modules retained outside the repository. Size and final integrity checks are recorded in docs/log-stage-s.md.','']
 (E/'docs/handover-stage-s.md').write_text('\n'.join(hand))
 with (E/'docs/log-stage-s.md').open('a') as f:
  rows=[];table(rows,['Release','Build','Probe','LLM P/F/load/timeout/other','Dev loaded/passed/failed','Wall seconds'],[[r[0],r[3],r[4],r[5],r[7],w[-1]] for r,w in zip(release_rows,wall)]);f.write('\n## Computed per-release results\n\n'+'\n'.join(rows))
 print(json.dumps({'releases':release_rows,'unmatched':unmatched,'wallSeconds':sum(r[-1] for r in wall)},indent=2))
if __name__=='__main__':main()
