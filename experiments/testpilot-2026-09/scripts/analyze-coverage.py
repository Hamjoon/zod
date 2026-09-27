"""Stage C, Step 6: coverage analysis at t = v4.0.5 (host, standard library; recorded artifacts only).
Reads the merged D-restricted maps (results/coverage/{s124,s60,dev}), the loading coverage, the per-test raw nyc maps in
$ROOT/coverage-raw/<set>/, file-set-D.txt, population-main.json, S124/S60, the survival matrices, and `git diff -U0` of the
clone. Writes results/coverage-summary.md, the CSV files, results/coverage/<set>/per-test-lines.json.gz and
results/coverage/analysis.json. Lines follow Istanbul's convention: a statement belongs to the line on which it starts."""
import collections,csv,gzip,json,re,statistics,subprocess
from pathlib import Path
E=Path(__file__).resolve().parents[1];R=E/'results';C=R/'coverage';Z=E.parents[1];RAW=Z.parent/'coverage-raw'
TAGS=['v4.1.0','v4.2.0','v4.3.0','v4.4.0','v4.5.0','v4.6.0']
SETS={'s124':dict(passing='gen-n124-passing.json',matrix='survival-n124-llm-matrix.csv',name='S124'),'s60':dict(passing='gen-n60-passing.json',matrix='survival-llm-matrix.csv',name='S60')}
def load(p):return json.loads(Path(p).read_text())
def rel(k):
 m=re.search(r'/packages/zod/src/(.*)$',k);return m.group(1) if m else k
def pct(a,b):return f'{a/b:.2%}' if b else 'N/A'
def table(L,head,rows):
 L+=['| '+' | '.join(head)+' |','| '+' | '.join('---' for _ in head)+' |']+['| '+' | '.join(str(x).replace('|','\\|') for x in r)+' |' for r in rows]+['']
def writecsv(name,head,rows):
 with (R/name).open('w',newline='') as f:w=csv.writer(f,lineterminator='\n');w.writerow(head);w.writerows(rows)
def uid(s,run=None):return (s.get('run') or run)+'/'+s['testName']
def lines_of(fc,covered_only):
 return {fc['statementMap'][i]['start']['line'] for i,c in fc['s'].items() if (c>0 or not covered_only)}
D=[l for l in (C/'file-set-D.txt').read_text().split('\n') if l]
def main():
 L=['# Stage C: coverage at t = v4.0.5','']
 maps={k:load(C/k/'coverage-final.json') for k in ('s124','s60','dev')};summ={k:load(C/k/'coverage-summary.json') for k in ('s124','s60','dev')}
 loadsum=load(C/'loading/coverage-summary.json');loadmap={rel(k):v for k,v in load(C/'loading/coverage-final.json').items()}
 for k in ('s124','s60'):assert sorted(maps[k])==sorted(D),k
 # a D file with no statements in the TypeScript-source instrumentation (re-export-only module) is absent from the developer map
 devmissing=sorted(set(D)-set(maps['dev']));assert set(maps['dev'])<=set(D)
 for f in devmissing:maps['dev'][f]={'statementMap':{},'s':{}}
 assert sorted(loadmap)==sorted(D)
 # identical instrumentation across the LLM maps (same nyc, same build)
 for f in D:assert maps['s124'][f]['statementMap']==maps['s60'][f]['statementMap']==loadmap[f]['statementMap'],f
 pop=load(R/'population-main.json');strata=dict(l.split('\t') for l in (R/'population-main.txt').read_text().splitlines());sample={e['accessPath'] for e in load(R/'api-sample-n60-s20260919.json')}
 results={k:load(C/k/'llm-results.json') for k in SETS}
 # ---------- per-test covered statements and lines (passing tests only) ----------
 pertest={};perlines={};nozod={k:[] for k in SETS}
 for k,cfg in SETS.items():
  pertest[k]={};perlines[k]={}
  for r in results[k]:
   if r['status']!='pass':continue
   u=uid(r,'gen-n60');raw=load(RAW/k/r['coverageFile']);cov={rel(x):v for x,v in raw.items() if rel(x) in D}
   # a test that never loads zod has an empty map: it covers nothing
   if not cov:nozod[k].append(u)
   for f in cov:assert cov[f]['statementMap']==maps['s124'][f]['statementMap'],(k,u,f)
   pertest[k][u]={f:{i for i,c in cov[f]['s'].items() if c>0} if f in cov else set() for f in D}
   perlines[k][u]={f:sorted(lines_of(cov[f],True)) if f in cov else [] for f in D}
  with gzip.open(C/k/'per-test-lines.json.gz','wt') as g:json.dump(dict(convention='covered lines per file (Istanbul: the start line of each covered statement), passing tests only, paths relative to packages/zod/src',tests={u:{f:ls for f,ls in v.items() if ls} for u,v in perlines[k].items()}),g,separators=(',',':'))
 # ---------- A. paper metrics ----------
 L+=['## A. Paper metrics (LLM corpora)','',f'Denominator: the file set D ({len(D)} files; see notes). Coverage of the passing tests only (tests that pass under nyc). Loading coverage is `require(\'zod\')` alone.','']
 metrics=('statements','branches','functions','lines');lt=loadsum['total'];rows=[]
 for m in metrics:
  row=[m,f"{lt[m]['covered']}/{lt[m]['total']} ({lt[m]['pct']}%)"]
  for k in ('s124','s60'):
   t=summ[k]['total'][m];row+=[f"{t['covered']}/{t['total']} ({t['pct']}%)",f"{t['pct']-lt[m]['pct']:+.2f} pp"]
  rows.append(row)
 npass={k:sum(r['status']=='pass' for r in results[k]) for k in SETS}
 table(L,['Metric','Loading','S124 ('+str(npass['s124'])+' tests)','S124 − loading','S60 ('+str(npass['s60'])+' tests)','S60 − loading'],rows)
 # per API function
 SRC=Z.parent/'zod-versions/v4.0.5-cov/packages/zod/src'
 perfn={};notfound=[]
 def locate(api):
  parts=api.split('.');name=parts[-1]
  files=['v4/classic/coerce.ts'] if parts[2]=='coerce' else ['v4/classic/iso.ts'] if parts[2]=='iso' else [f for f in D if f.startswith('v4/classic/') and f not in ('v4/classic/coerce.ts','v4/classic/iso.ts')]
  cands=[(f,fn) for f in files for fn in maps['s124'][f]['fnMap'].values() if fn['name'] in (name,'_'+name)]
  exported=[]
  for f,fn in cands:
   text=(SRC/f).read_text().split('\n');line=text[fn['decl']['start']['line']-1]
   if re.match(rf'\s*export function {re.escape(fn["name"])}\b',line) or re.search(rf'\b{re.escape(fn["name"])} as {re.escape(name)}\b',(SRC/f).read_text()):exported.append((f,fn))
  if len(exported)==1:
   f,fn=exported[0];lo,hi=fn['loc']['start'],fn['loc']['end']
   ids=[i for i,s in maps['s124'][f]['statementMap'].items() if (s['start']['line'],s['start']['column'])>(lo['line'],lo['column']) and (s['end']['line'],s['end']['column'])<=(hi['line'],hi['column'])]
   return f,fn['decl']['start']['line'],'fnMap',ids
  # fallback: a classic file re-exports a core function (`export { _lt as lt } from "../core/index.js"`); take that function in core/
  for f in files:
   m=re.search(rf'\b(\w+) as {re.escape(name)}\b[^;]*?from "\.\./core/index\.js"',(SRC/f).read_text(),re.S)
   if not m:continue
   orig=m.group(1);hits=[]
   for g in [x for x in D if x.startswith('v4/core/')]:
    for fn in maps['s124'][g]['fnMap'].values():
     if fn['name']==orig and re.match(rf'\s*export function {re.escape(orig)}\b',(SRC/g).read_text().split('\n')[fn['decl']['start']['line']-1]):hits.append((g,fn))
   if len(hits)==1:
    g,fn=hits[0];lo,hi=fn['loc']['start'],fn['loc']['end']
    ids=[i for i,st in maps['s124'][g]['statementMap'].items() if (st['start']['line'],st['start']['column'])>(lo['line'],lo['column']) and (st['end']['line'],st['end']['column'])<=(hi['line'],hi['column'])]
    return g,fn['decl']['start']['line'],f'fnMap via re-export in {f}',ids
  # fallback: text search for an exported const
  for f in files:
   text=(SRC/f).read_text().split('\n')
   for n,line in enumerate(text,1):
    if re.match(rf'export const {re.escape(name)}\b',line):
     end=n
     while not text[end-1].rstrip().endswith(';'):end+=1
     ids=[i for i,s in maps['s124'][f]['statementMap'].items() if n<=s['start']['line']<=end]
     return f,n,'text (exported const)',ids
  return None
 for e in pop:
  api=e['accessPath'];loc=locate(api)
  if loc is None:notfound.append(api);continue
  perfn[api]=loc
 fnrows={};stats={}
 for k in SETS:
  rows=[];fr=[]
  for e in pop:
   api=e['accessPath']
   if api not in perfn:rows.append([api,strata[api],api in sample,'','','not located','','','']);continue
   f,decl,how,ids=perfn[api];cov=sum(maps[k][f]['s'][i]>0 for i in ids);frac=cov/len(ids) if ids else None
   rows.append([api,strata[api],api in sample,f,decl,how,len(ids),cov,f'{frac:.4f}' if frac is not None else ''])
   if frac is not None and (k=='s124' or api in sample):fr.append((api,frac,len(ids)))
  writecsv(f'coverage-per-function-{k}.csv',['api','stratum','inN60Sample','file','declLine','located','statements','covered','fraction'],rows)
  fs=[x[1] for x in fr];stats[k]=dict(functions=len(fr),min=min(fs),median=statistics.median(fs),max=max(fs),zero=sum(x==0 for x in fs),full=sum(x==1 for x in fs),bodyMin=min(x[2] for x in fr),bodyMedian=statistics.median(x[2] for x in fr),bodyMax=max(x[2] for x in fr),zeroList=sorted(x[0] for x in fr if x[1]==0))
 L+=['### Statement coverage per API function','','For each function of `population-main.json`, the statements inside its declaration (Istanbul `fnMap` of the merged map: the exported function of that name, or `_name` exported as `name`, in `src/v4/classic/*.ts`, or `coerce.ts`/`iso.ts` for `coerce.*`/`iso.*`; fallbacks: a re-export `_name as name` from `../core/index.js` in a classic file, followed to the exported function `_name` in `src/v4/core/`, then a text search for an exported `const`), and the fraction covered by all of the set\'s passing tests. S124 over its 124 functions, S60 over its 60 sampled functions (all 124 are in the CSV).','']
 table(L,['Set','Functions','Min','Median','Max','At 0%','At 100%','Body statements min / median / max'],[[SETS[k]['name'],s['functions'],f"{s['min']:.2%}",f"{s['median']:.2%}",f"{s['max']:.2%}",s['zero'],s['full'],f"{s['bodyMin']} / {s['bodyMedian']} / {s['bodyMax']}"] for k,s in stats.items()])
 how=collections.Counter(v[2] for v in perfn.values())
 L+=[f'Located: {len(perfn)} of {len(pop)} ({", ".join(f"{n} by {h}" for h,n in how.items())}). Not located: '+(', '.join(f'`{a}`' for a in notfound) or 'none')+'.','',
  'Functions at 0% — S124: '+(', '.join(f'`{a}`' for a in stats['s124']['zeroList']) or 'none')+'; S60: '+(', '.join(f'`{a}`' for a in stats['s60']['zeroList']) or 'none')+'.','']
 # uniquely contributing tests
 uniq={}
 for k in SETS:
  cnt=collections.Counter((f,i) for u,v in pertest[k].items() for f,ids in v.items() for i in ids)
  uniq[k]=sorted(u for u,v in pertest[k].items() if any(cnt[(f,i)]==1 for f,ids in v.items() for i in ids))
 L+=['### Uniquely contributing tests','','A passing test that covers at least one statement of D that no other passing test of the same set covers (from the per-test raw maps).','']
 table(L,['Set','Passing tests','Uniquely contributing','Share'],[[SETS[k]['name'],len(pertest[k]),len(uniq[k]),pct(len(uniq[k]),len(pertest[k]))] for k in SETS])
 # ---------- B. developer reference ----------
 L+=['## B. Developer reference','','The 888 frozen v4.0.5 developer cases, vitest-istanbul on the TypeScript source, restricted to D.','']
 table(L,['Metric','Loading','Developer suite','Developer − loading'],[[m,f"{lt[m]['covered']}/{lt[m]['total']} ({lt[m]['pct']}%)",f"{summ['dev']['total'][m]['covered']}/{summ['dev']['total'][m]['total']} ({summ['dev']['total'][m]['pct']}%)",f"{summ['dev']['total'][m]['pct']-lt[m]['pct']:+.2f} pp"] for m in metrics])
 L+=['Statement, branch and function totals differ between the developer map and the LLM maps because the transforms differ (vitest-istanbul instruments the TypeScript source; nyc instruments the built JavaScript and remaps). Compare corpora at line level (part C).','']
 # ---------- C. line level ----------
 execl={f:lines_of(maps['s124'][f],False)|lines_of(maps['dev'][f],False) for f in D}
 covl={k:{f:lines_of(maps[k][f],True) for f in D} for k in maps}
 L+=['## C. Line-level comparison with the developer suite','','Executable lines of a file: lines on which at least one statement starts in either corpus\'s map. A line is covered by a corpus if a covered statement of that corpus starts on it.','']
 ctot={}
 for k in SETS:
  rows=[];tot=collections.Counter()
  for f in D:
   ex=execl[f];a=covl[k][f]&ex;d=covl['dev'][f]&ex
   c=dict(executable=len(ex),llm=len(a),dev=len(d),both=len(a&d),llmOnly=len(a-d),devOnly=len(d-a),neither=len(ex-a-d));tot.update(c);rows.append([f,*c.values()])
  rows.append(['TOTAL',*[tot[x] for x in ('executable','llm','dev','both','llmOnly','devOnly','neither')]]);ctot[k]=tot
  writecsv(f'coverage-lines-{k}-vs-dev.csv',['file','executable','covered_llm','covered_dev','both','llm_only','dev_only','neither'],rows)
 # the same totals without the D files that have no statements in the developer (TypeScript-source) map: re-export-only modules
 cex={}
 for k in SETS:
  t=collections.Counter()
  for f in D:
   if f in devmissing:continue
   ex=execl[f];a_=covl[k][f]&ex;d_=covl['dev'][f]&ex;t.update(dict(executable=len(ex),llm=len(a_),dev=len(d_),both=len(a_&d_),llmOnly=len(a_-d_),devOnly=len(d_-a_),neither=len(ex-a_-d_)))
  cex[k]=t
 table(L,['Comparison','Executable lines','LLM','Dev','Both','LLM only','Dev only','Neither'],[[f"{SETS[k]['name']} vs dev",t['executable'],f"{t['llm']} ({pct(t['llm'],t['executable'])})",f"{t['dev']} ({pct(t['dev'],t['executable'])})",t['both'],t['llmOnly'],t['devOnly'],t['neither']] for k,t in ctot.items()]+[[f"{SETS[k]['name']} vs dev, without the {len(devmissing)} re-export-only files",t['executable'],f"{t['llm']} ({pct(t['llm'],t['executable'])})",f"{t['dev']} ({pct(t['dev'],t['executable'])})",t['both'],t['llmOnly'],t['devOnly'],t['neither']] for k,t in cex.items()])
 L+=[f'The {len(devmissing)} files ' + ', '.join(f'`{f}`' for f in devmissing) + ' only re-export (`export { … } from`, `export * from`). Instrumented as TypeScript source they have no statements, so the developer map omits them. The CommonJS build turns the re-exports into getter code, so the LLM map has statements there. Their lines count as executable and cannot be covered by the developer corpus under this definition, hence the second pair of rows.','']
 lf=collections.Counter();[lf.update({'locales' if f.startswith('v4/locales/') else f.split('/')[1] if '/' in f else f:len(execl[f])}) for f in D]
 L+=['Executable lines by area: '+', '.join(f'{a} {n}' for a,n in lf.items())+'. Per-file rows are in `coverage-lines-<set>-vs-dev.csv`.','']
 # ---------- D. changed code ----------
 changed={}
 for t in TAGS:
  out=subprocess.run(['git','-C',str(Z),'diff','-U0','v4.0.5',t,'--','packages/zod/src'],check=True,capture_output=True,text=True).stdout
  cur=None;ch=collections.defaultdict(set)
  for line in out.split('\n'):
   if line.startswith('--- '):p=line[4:];cur=p[len('a/packages/zod/src/'):] if p.startswith('a/packages/zod/src/') else None
   elif line.startswith('@@') and cur and cur in D and 'tests' not in Path(cur).parts:
    m=re.match(r'@@ -(\d+)(?:,(\d+))? \+',line);a,b=int(m.group(1)),int(m.group(2) if m.group(2) is not None else 1)
    ch[cur].update(range(a,a+b))
  changed[t]={f:ls&execl[f] for f,ls in ch.items()}
 rows=[];drows=[]
 for t in TAGS:
  c=collections.Counter()
  for f,ls in changed[t].items():
   s=covl['s124'][f]&ls;d=covl['dev'][f]&ls;s6=covl['s60'][f]&ls
   c.update(dict(changed=len(ls),s124=len(s),dev=len(d),both=len(s&d),s124Only=len(s-d),devOnly=len(d-s),neither=len(ls-s-d),s60=len(s6)))
  rows.append([t,c['changed'],c['s124'],c['dev'],c['both'],c['s124Only'],c['devOnly'],c['neither'],c['s60']]);drows.append(rows[-1])
 writecsv('coverage-changed-lines.csv',['release','changed_executable_lines','covered_s124','covered_dev','both','s124_only','dev_only','neither','covered_s60'],drows)
 L+=['## D. Changed-code coverage','','Old-side lines of `git diff -U0 v4.0.5 <tag> -- packages/zod/src` (lines of v4.0.5 modified or deleted by the release) in files of D, excluding `tests/`, intersected with the executable lines of part C; coverage at t.','']
 table(L,['Release','Changed executable lines','S124','Dev','Both','S124 only','Dev only','Neither','(S60)'],rows)
 cross={}
 for k,cfg in SETS.items():
  status={}
  with (R/cfg['matrix']).open() as f:
   for r in csv.DictReader(f):status[r['testName'] if k=='s124' else 'gen-n60/'+r['testName']]=r['status@v4.6.0']
  ch6=changed['v4.6.0'];rows=[];xt=collections.Counter()
  for u,v in perlines[k].items():
   hit=sum(len(set(v[f])&ls) for f,ls in ch6.items());st=status[u];survived=st=='pass'
   rows.append([u,hit,hit>0,st]);xt[(hit>0,survived)]+=1
  writecsv(f'coverage-changed-by-test-{k}.csv',['test','changed_v4.6.0_lines_covered','executed_changed_code','survival_status_v4.6.0'],rows);cross[k]=xt
 L+=['### Executing changed code (v4.6.0) vs surviving to v4.6.0','','Per passing test: did it cover at least one changed executable line of v4.6.0 at t, and did it pass at v4.6.0 (survival matrix)?','']
 table(L,['Set','Executed changed code, survived','Executed changed code, broke','Never executed it, survived','Never executed it, broke'],[[SETS[k]['name'],x[(True,True)],x[(True,False)],x[(False,True)],x[(False,False)]] for k,x in cross.items()])
 # ---------- E. notes ----------
 dirs=collections.Counter(str(Path(f).parent) for f in D)
 excluded={k:[uid(r,'gen-n60')+' ('+r['status']+')' for r in results[k] if r['status']!='pass'] for k in SETS}
 L+=['## E. Notes','',
  f'- **Denominator D**: the {len(D)} `src/**/*.ts` files in the remapped nyc report of `require(\'.\')` in the coverage build (`results/coverage/file-set-D.txt`, from Step 3): '+', '.join(f'{"src/ (root)" if d=="." else d} {n}' for d,n in sorted(dirs.items()))+'. All 40 locale files are loaded by `require(\'zod\')` (the locales index imports every locale), not just the default one. No `tests/` file is in D. The same D is used for every corpus.',
  '- **Two measurement routes.** The LLM corpora run on the built CommonJS files under nyc, remapped through source maps to the TypeScript source. The developer suite runs on the TypeScript source under vitest\'s Istanbul provider. Statement, branch and function counts are therefore per corpus and are not subtracted from each other; the cross-corpus comparison is at line level (C, D).',
  '- **Different targets.** The LLM corpora target 124 (S124) or 60 (S60) public functions; the developer suite targets the whole package. The package-level gap is expected and is context, not a finding.',
  f'- D files absent from the developer map (re-export-only modules: no statements when the TypeScript source is instrumented; see part C): '+(', '.join(f'`{f}`' for f in devmissing) or 'none')+'.',
  '- Passing tests that never load zod (empty coverage map; they count as passing tests that cover nothing): S124 '+(', '.join(f'`{u}`' for u in nozod['s124']) or 'none')+'; S60 '+(', '.join(f'`{u}`' for u in nozod['s60']) or 'none')+'.',
  '- Tests excluded from coverage because they did not pass under nyc: S124 '+(', '.join(excluded['s124']) or 'none')+'; S60 '+(', '.join(excluded['s60']) or 'none')+'.','']
 (R/'coverage-summary.md').write_text('\n'.join(L))
 out=dict(D=len(D),devMissing=devmissing,noZod=nozod,passing=npass,A={k:{m:summ[k]['total'][m] for m in metrics} for k in SETS},loading={m:lt[m] for m in metrics},dev={m:summ['dev']['total'][m] for m in metrics},perFunction=stats,notLocated=notfound,unique={k:len(v) for k,v in uniq.items()},lines={k:dict(v) for k,v in ctot.items()},linesWithoutReexportFiles={k:dict(v) for k,v in cex.items()},changed={r[0]:r[1:] for r in drows},cross={k:{f'{"executed" if a else "not executed"}/{"survived" if b else "broke"}':n for (a,b),n in x.items()} for k,x in cross.items()})
 (C/'analysis.json').write_text(json.dumps(out,indent=2,default=str)+'\n');print(json.dumps(out,indent=1,default=str))
if __name__=='__main__':main()
