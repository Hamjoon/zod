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
 with (R/name).open('w',newline='') as f:w=csv.writer(f,lineterminator="\n");w.writerow(headers);w.writerows(rows)
def key(c):return c['file'],c['fullName'],c['occurrence']
def firstbreak(states,passing):return next((t for t,s in states if s not in (passing,'unavailable','todo')),'')
def rebound(states,passing):
 broken=False
 for t,s in states:
  if s in ('unavailable','todo'):continue
  if s!=passing:broken=True
  elif broken:return True
 return False
def dev_category(c):
 message=c.get('message_first_line','')
 if 'Snapshot' in message and 'mismatched' in message:return 'snapshot'
 if c.get('file_load_failed'):return 'load'
 if message.startswith('AssertionError'):return 'assertion'
 return 'other'
def main():
 refs=load(D/'tags.json');tags=[r['tag'] for r in refs];later=tags[1:];S=load(R/'gen-n60-passing.json');sample=load(R/'api-sample-n60-s20260919.json');strata=dict(l.split('\t') for l in (R/'population-main.txt').read_text().splitlines())
 assert len(S)==139
 llm={t:{r['testName']:r for r in optional(D/t/'llm-results.json',[])} for t in tags};dev={t:{key(c):c for c in optional(D/t/'dev-cases.json',[])} for t in tags};baseline=list(dev[tags[0]])
 assert len(baseline)==888
 for t in tags:
  if dev[t]:assert set(dev[t])==set(baseline),f'Case identity mismatch at {t}'
 def ls(t,n):return llm[t].get(n,{}).get('status','unavailable')
 def ds(t,k):return dev[t].get(k,{}).get('status','unavailable')
 funcs=[f['accessPath'] for f in sample if any(s['api']==f['accessPath'] for s in S)];assert len(funcs)==54
 def survivors(t,api):return sum(ls(t,s['testName'])=='pass' for s in S if s['api']==api)
 lines=['# Stage S survival analysis','','All tests are frozen at v4.0.5. LLM denominator is 139; developer denominator is 888 runtime cases. Harness failures are unavailable, never test failures. Developer file-load failures inherit the baseline cases as failed. Test-file A/M/D counts describe ignored upstream edits only.','']
 release_rows=[];wall=[]
 for r in refs:
  t=r['tag'];b=optional(D/t/'build-status.json',{});d=optional(D/t/'dev-summary.json',{});counts=collections.Counter(v['status'] for v in llm[t].values());changes=collections.Counter(l.split()[0] for l in (D/t/'devtest-diff.txt').read_text().splitlines());l_ok=bool(llm[t]);d_ok=bool(d)
  release_rows.append([t,r['commit'],r['date'],'ok' if b.get('build') else 'failed',b.get('probe','not-run'),'/'.join(str(counts[s]) for s in ['pass','fail','load-error','timeout','other']) if l_ok else 'unavailable',f"{counts['pass']}/139 ({counts['pass']/139:.2%})" if l_ok else 'unavailable',f"{d['files_loaded']}/{d['passed']}/{d['failed']}/{d['skipped']}" if d_ok else 'unavailable',f"{d['passed']}/888 ({d['passed']/888:.2%})" if d_ok else 'unavailable','/'.join(str(changes[x]) for x in ['A','M','D'])])
  secs=[b.get('wallSeconds',0),optional(D/t/'llm-summary.json',{}).get('wallSeconds',0),optional(D/t/'dev-status.json',{}).get('wallSeconds',0)];wall.append([t,*[round(x,3) for x in secs],round(sum(secs),3)])
 header=['Tag','Commit','Date','Build','Probe','LLM P/F/load/timeout/other','LLM survival','Dev loaded/passed/failed/skipped','Dev survival','Dev A/M/D'];table(lines,header,release_rows)
 lines+=['## Per stratum',''];table(lines,['Stratum','Tests in S',*tags],[[s,len(ts:= [v for v in S if strata[v['api']]==s]),*[f"{sum(ls(t,v['testName'])=='pass' for v in ts)}/{len(ts)} ({sum(ls(t,v['testName'])=='pass' for v in ts)/len(ts):.2%})" if llm[t] else 'unavailable' for t in tags]] for s in ['S','C','Q']])
 lines+=['## Per function',''];table(lines,['Function','Tests in S',*later],[[api,sum(s['api']==api for s in S),*[survivors(t,api) if llm[t] else 'unavailable' for t in later]] for api in funcs])
 spec=importlib.util.spec_from_file_location('analyze_gen',E/'scripts/analyze-gen.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
 candidates=[]
 for t in tags:
  if not llm[t]:
   lines += [f'## LLM failures: {t}','','Unavailable: no LLM execution for this release.',''];continue
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
 writecsv('survival-dev-matrix.csv',['file','fullName','occurrence',*['status@'+t for t in tags],'first_break'],dev_matrix)
 lines+=['## First breaks and returns to passing','','Developer identity is file + fullName + one-based occurrence in the frozen declaration order. All available runs must preserve the baseline identities. Unavailable releases are not evidence of survival; never-break counts mean no observed break in available runs. Todo is neither a break nor a survival and is ignored in rebound transitions. First breaks include the control; non-passing baseline observations are retained. A return to passing is any later pass following a non-pass.',''];table(lines,['Corpus','No observed break (available releases only)','Break then pass again'],[['LLM',sum(r[2]=='never' for r in llm_break),sum(r[3] for r in llm_break)],['Dev',sum(r[3]=='never' for r in dev_break),sum(r[4] for r in dev_break)]])
 table(lines,['LLM test','API','First break','Pass again'],llm_break);table(lines,['Dev file','Case','Occurrence','First break','Pass again'],dev_break)
 for t in tags:
  if not dev[t]:
   lines += [f'## Developer failures by file: {t}','','Unavailable: no validated runtime-only developer result.',''];continue
  lines += [f'## Developer failures by file: {t}',''];group=collections.defaultdict(list)
  for c in dev[t].values():
   if c['status']=='failed':group[c['file']].append(c)
  table(lines,['File','Failed cases','First message'],[[f,len(cs),cs[0]['message_first_line']] for f,cs in sorted(group.items())])
 files=sorted({k[0] for k in baseline});existing_map=optional(R/'pair-map.json',{});mapping={};unmatched=[];pair_rows=[]
 for api in funcs:
  name=api.split('.')[-1];kebab=re.sub(r'(?<!^)(?=[A-Z])','-',name).lower();names=list(dict.fromkeys([name,name.lower(),kebab,kebab+'s']))
  matches=[f for f in files if Path(f).parent.as_posix() in ['classic/tests','core/tests','mini/tests'] and Path(f).name in [n+'.test.ts' for n in names]];matches=existing_map.get(api,matches);mapping[api]=matches
  if not matches:unmatched.append(api)
  count=sum(s['api']==api for s in S);keys=[k for k in baseline if k[0] in matches];row=[api,'; '.join(matches),count,len(keys)]
  for t in later:row += [survivors(t,api) if llm[t] else 'unavailable',sum(ds(t,k)=='passed' for k in keys) if matches and dev[t] else 'unmatched' if not matches else 'unavailable',sum(ds(t,k) not in ('passed','failed','unavailable') for k in keys) if matches and dev[t] else 'unmatched' if not matches else 'unavailable']
  pair_rows.append(row)
 (R/'pair-map.json').write_text(json.dumps(mapping,indent=2)+'\n');pair_header=['Function','Dev files','LLM baseline','Dev baseline',*[v for t in later for v in [t+' LLM survivors',t+' dev passed',t+' dev skipped']]]
 writecsv('survival-pairs.csv',pair_header,pair_rows);lines+=['## Automatic file-name pairing','','Matches are filename-based; counts sum all exact/lowercase/kebab/plural matches across classic, core, and mini. This does not establish semantic equivalence between corpora.',''];table(lines,pair_header,pair_rows)
 lines+=['Functions with no automatic match:','',*[f'- `{api}`' for api in unmatched],'','## Flaky at t',''];flaky=[v for v in llm[tags[0]].values() if v['status']!='pass'];table(lines,['Test','Status','Error'],[[v['testName'],v['status'],v['err']] for v in flaky]);lines+=['No exclusions; all 139 remain in the denominator.','','## Measured wall times',''];table(lines,['Release','Install/build/env seconds','LLM seconds','Dev seconds','Total seconds'],wall);lines += [f"Sum of recorded per-release stages (not end-to-end wall time): {sum(r[-1] for r in wall):.3f} seconds.",'']
 dev_category_rows=[];dev_candidates=[]
 for t in tags:
  counts=collections.Counter(dev_category(c) for c in dev[t].values() if c['status']=='failed')
  dev_category_rows.append([t,*[counts[k] if dev[t] else 'unavailable' for k in ['snapshot','load','assertion','other']]])
  for c in sorted(dev[t].values(),key=key):
   if c['status']=='failed':dev_candidates.append([t,c['file'],c['fullName'],c['occurrence'],dev_category(c),c['message_first_line'],'likely non-contract assertion; manual review required' if dev_category(c)=='snapshot' else 'manual review required'])
 lines+=['## Developer failure categories','','Ordered predicates: snapshot (Snapshot and mismatched), load (file_load_failed), assertion (starts AssertionError), other. Snapshot flags are candidates for manual review, not a final contract classification.',''];table(lines,['Release','Snapshot','Load','Assertion','Other'],dev_category_rows)
 for t in tags:
  lines += [f'### Failed developer cases grouped by file: {t}','']
  table(lines,['File','Case','Occurrence','Category','First message','Review flag'],[r[1:] for r in dev_candidates if r[0]==t])
  lines += [f'### Matched-function cross table: {t}','','Developer counts sum only the files in the unchanged automatic pairing map.','']
  cross=[]
  for api,matched in mapping.items():
   if not matched:continue
   ts=[v for v in S if v['api']==api];ks=[k for k in baseline if k[0] in matched]
   lc=collections.Counter(ls(t,v['testName']) for v in ts);dc=collections.Counter(ds(t,k) for k in ks)
   cross.append([api,len(ts),'/'.join(str(lc[k]) for k in ['pass','fail','load-error','timeout','other']) if llm[t] else 'unavailable',len(ks),'/'.join(str(v) for v in [dc['passed'],dc['failed'],sum(n for k,n in dc.items() if k not in ['passed','failed','unavailable'])]) if dev[t] else 'unavailable'])
  table(lines,['API','LLM baseline','LLM pass/fail/load/timeout/other','Dev baseline','Dev passed/failed/skipped'],cross)
 (R/'survival-summary.md').write_text('\n'.join(lines))
 hand=['## Continuation 4','','Only v4.6.0 was executed in this addendum. Developer and LLM artifacts for v4.0.5–v4.5.0 remain unchanged.',''];table(hand,header,release_rows)
 hand+=['### D-24 / D-25 and dependency provenance','',
 'D-24: pnpm install --no-frozen-lockfile --ignore-scripts under HUSKY=0 COREPACK_ENABLE_PROJECT_SPEC=0 skips the nub-based docs postinstall and husky prepare. nub was not installed.',
 'D-25: npx --no-install zshy --project tsconfig.build.json was run directly inside packages/zod. The root pnpm build and package postbuild (stub package.json writer and biome formatting) were not run. The required index.cjs, index.js and index.d.cts were produced directly, and the CommonJS entry was probed.',
 'The v4.6.0 dependency set is the addendum 3 resolution (D-22), not a claim of the original release dependency environment. The resolved lockfile remains recorded in results/survival/v4.6.0/pnpm-lock.resolved.yaml.','']
 b460=optional(D/'v4.6.0/build-status.json',{});d460=optional(D/'v4.6.0/dev-status.json',{})
 table(hand,['Package','Resolved version'],list(b460.get('resolvedVersions',{}).items()))
 table(hand,['Install','Build','Probe','Lockfile changed','Fallbacks','Error'],[[b460.get('install'),b460.get('build'),b460.get('probe'),b460.get('resolvedLockChanged'),b460.get('fallbacks'),b460.get('error','')]])
 table(hand,['Developer command','Harness','Runtime split','Error'],[[d460.get('command'),d460.get('harness'),d460.get('runtimeSplit'),d460.get('error','')]])
 dev460=optional(D/'v4.6.0/dev-summary.json',{});llm460=optional(D/'v4.6.0/llm-summary.json',{})
 table(hand,['v4.6.0 corpus','Passed','Failed','Skipped/load-error','Timeout','Total'],[['Developer',dev460.get('passed','unavailable'),dev460.get('failed','unavailable'),dev460.get('skipped','unavailable'),'n/a',dev460.get('cases','unavailable')],['LLM',llm460.get('pass','unavailable'),llm460.get('fail',0),llm460.get('load-error',0),llm460.get('timeout',0),len(llm['v4.6.0'])]])
 hand+=['D-21 meta.typecheck splitting and D-15 occurrence identities remain in force. The 81-file / 888-case identity gate and 139-result / 278-raw-file LLM checks are recorded in log-stage-s.md. Todo remains skipped and neither a break nor a survival.','', '### Developer failure categories',''];table(hand,['Release','Snapshot','Load','Assertion','Other'],dev_category_rows)
 hand+=['### Second-pass candidates','','LLM assertion failures remain unclassified:',''];table(hand,['Release','Test','API','Error'],candidates)
 hand+=['Developer failures by release and file; snapshot rows are flagged as likely non-contract assertion candidates for manual review, not classified here.',''];table(hand,['Release','File','Case','Occurrence','Category','First message','Review flag'],dev_candidates)
 hand+=['### Recorded wall times and cleanup',''];table(hand,['Release','Install/build/env seconds','LLM seconds','Developer seconds','Recorded total seconds'],wall)
 hand += [f"Recorded stage sum: {sum(r[-1] for r in wall):.3f} seconds. Earlier-release times belong to their original executions; setup, reprocessing, earlier failed v4.6.0 attempts and cleanup are excluded.",'','Wrapper restored to ../../../../../packages/zod and verified at 4.0.5; no test-s remains. Export size and final integrity verification are recorded in log-stage-s.md. No report or archive branch created.','']
 handover=E/'docs/handover-stage-s.md';previous=handover.read_text().split('\n## Continuation 4\n',1)[0].rstrip();handover.write_text(previous+'\n\n'+'\n'.join(hand))
 with (E/'docs/log-stage-s.md').open('a') as f:
  rows=[];table(rows,['Release','Build','Probe','LLM P/F/load/timeout/other','Dev loaded/passed/failed/skipped','Wall seconds'],[[r[0],r[3],r[4],r[5],r[7],w[-1]] for r,w in zip(release_rows,wall)]);f.write('\n## Computed per-release results\n\n'+'\n'.join(rows))
 print(json.dumps({'releases':release_rows,'unmatched':unmatched,'wallSeconds':sum(r[-1] for r in wall)},indent=2))
if __name__=='__main__':main()
